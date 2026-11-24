import {
  ANSWER_SPOOL_FILE_PREFIX,
  ANSWER_SPOOL_FILE_SUFFIX,
  doneLine,
  eventLine,
  isOrphaned,
  isOwnRegularFile,
  isPrivateDirectory,
  isSpoolFileName,
  type NodeModules,
  nodeModules,
  OWNER_ONLY_DIRECTORY_MODE,
  OWNER_ONLY_FILE_MODE,
  ownerLine,
  ownerOf,
  type SpooledAnswerEvent,
  unsentEvents,
} from './answer-spool-files.js'

export const ANSWER_SPOOL_HEARTBEAT_MS = 30_000
const SPOOL_COMPACT_AFTER_BYTES = 16 * 1024 * 1024
const RECOVERED_FILE_MAXIMUM_BYTES = 64 * 1024 * 1024
const FILE_NOT_FOUND = 'ENOENT'

const liveInstances = new Set<string>()

export type SpoolWarning = (message: string, details: Readonly<Record<string, unknown>>) => void

function errorCode(error: unknown): unknown {
  return error instanceof Error && 'code' in error ? error.code : undefined
}

export class AnswerSpool {
  private readonly instance = crypto.randomUUID()
  private readonly host: string
  private descriptor: number | undefined
  private filePath: string | undefined
  private writtenBytes = 0
  private lineBreakOwed = false
  private heartbeat: ReturnType<typeof setInterval> | undefined
  private readonly modules: NodeModules
  private readonly directory: string
  private readonly destination: string
  private readonly warn: SpoolWarning
  private readonly pendingEvents: () => readonly SpooledAnswerEvent[]

  private constructor(
    modules: NodeModules,
    directory: string,
    destination: string,
    warn: SpoolWarning,
    pendingEvents: () => readonly SpooledAnswerEvent[],
  ) {
    this.modules = modules
    this.directory = directory
    this.destination = destination
    this.warn = warn
    this.pendingEvents = pendingEvents
    this.host = modules.os.hostname()
    liveInstances.add(this.instance)
  }

  static open(
    directory: string,
    destination: string,
    warn: SpoolWarning,
    pendingEvents: () => readonly SpooledAnswerEvent[],
  ): AnswerSpool | undefined {
    const modules = nodeModules()
    if (modules === undefined) return undefined
    try {
      modules.fs.mkdirSync(directory, { recursive: true, mode: OWNER_ONLY_DIRECTORY_MODE })
      if (!isPrivateDirectory(modules, directory)) {
        warn('The answer spool directory is shared with other users, so answers are kept in memory only', {
          directory,
        })
        return undefined
      }
      return new AnswerSpool(modules, directory, destination, warn, pendingEvents)
    } catch (error) {
      warn('The answer spool directory is unusable, so answers are kept in memory only', { directory, error })
      return undefined
    }
  }

  append(items: readonly SpooledAnswerEvent[]): boolean {
    if (items.length === 0) return true
    return this.write(items.map(eventLine).join(''))
  }

  markDone(ids: readonly string[]): void {
    if (ids.length === 0 || this.descriptor === undefined) return
    this.write(doneLine(ids))
  }

  settle(): void {
    if (this.descriptor === undefined) return
    if (this.pendingEvents().length === 0) {
      this.discardFile()
      return
    }
    if (this.writtenBytes > SPOOL_COMPACT_AFTER_BYTES) this.replaceFile()
  }

  close(keepUnsent: boolean): void {
    clearInterval(this.heartbeat)
    this.heartbeat = undefined
    if (keepUnsent && this.pendingEvents().length > 0) this.closeDescriptor()
    else this.discardFile()
    liveInstances.delete(this.instance)
  }

  recoverOrphans(): SpooledAnswerEvent[] {
    const { fs, path } = this.modules
    const recovered: SpooledAnswerEvent[] = []
    let names: string[]
    try {
      names = fs.readdirSync(this.directory)
    } catch (error) {
      this.warn('The answer spool directory could not be read', { directory: this.directory, error })
      return recovered
    }
    const ownName = this.filePath === undefined ? undefined : path.basename(this.filePath)
    for (const name of names) {
      if (!isSpoolFileName(name) || name === ownName) continue
      recovered.push(...this.recoverFile(path.join(this.directory, name)))
    }
    return recovered
  }

  private recoverFile(filePath: string): SpooledAnswerEvent[] {
    const { fs, path } = this.modules
    try {
      const stats = fs.lstatSync(filePath)
      if (!isOwnRegularFile(stats)) return []
      const owner = ownerOf(this.modules, filePath)
      if (owner?.destination !== this.destination) return []
      const self = { host: this.host, liveInstances }
      if (!isOrphaned(owner, stats.mtimeMs, self, Date.now())) return []
      if (stats.size > RECOVERED_FILE_MAXIMUM_BYTES) {
        this.warn('An answer spool file left by an earlier process is too large to send', { filePath })
        return []
      }
      const claimedName = `${ANSWER_SPOOL_FILE_PREFIX}claimed-${crypto.randomUUID()}${ANSWER_SPOOL_FILE_SUFFIX}`
      const claimed = path.join(this.directory, claimedName)
      fs.renameSync(filePath, claimed)
      const claimedStats = fs.lstatSync(claimed)
      if (!isOwnRegularFile(claimedStats) || claimedStats.size > RECOVERED_FILE_MAXIMUM_BYTES) {
        fs.unlinkSync(claimed)
        return []
      }
      const events = unsentEvents(fs.readFileSync(claimed, 'utf8'))
      if (!this.append(events)) return []
      fs.unlinkSync(claimed)
      return events
    } catch (error) {
      if (errorCode(error) !== FILE_NOT_FOUND) {
        this.warn('An answer spool file left by an earlier process could not be read', { filePath, error })
      }
      return []
    }
  }

  private ensureFile(): number {
    if (this.descriptor !== undefined) return this.descriptor
    const { fs, path } = this.modules
    const name = `${ANSWER_SPOOL_FILE_PREFIX}${this.instance}-${crypto.randomUUID()}${ANSWER_SPOOL_FILE_SUFFIX}`
    const filePath = path.join(this.directory, name)
    const descriptor = fs.openSync(filePath, 'wx', OWNER_ONLY_FILE_MODE)
    this.descriptor = descriptor
    this.filePath = filePath
    this.writtenBytes = 0
    this.lineBreakOwed = false
    this.writeAll(
      descriptor,
      ownerLine({ host: this.host, pid: process.pid, instance: this.instance, destination: this.destination }),
    )
    this.startHeartbeat()
    return descriptor
  }

  private write(text: string): boolean {
    try {
      const descriptor = this.ensureFile()
      this.writeAll(descriptor, this.lineBreakOwed ? `\n${text}` : text)
      this.modules.fs.fsyncSync(descriptor)
      this.lineBreakOwed = false
      return true
    } catch (error) {
      this.lineBreakOwed = true
      this.warn('An answer could not be written to the spool, so it is kept in memory only', { error })
      return false
    }
  }

  private writeAll(descriptor: number, text: string): void {
    const bytes = new TextEncoder().encode(text)
    let offset = 0
    while (offset < bytes.byteLength) {
      offset += this.modules.fs.writeSync(descriptor, bytes, offset, bytes.byteLength - offset)
    }
    this.writtenBytes += bytes.byteLength
  }

  private startHeartbeat(): void {
    if (this.heartbeat !== undefined) return
    this.heartbeat = setInterval(() => this.touch(), ANSWER_SPOOL_HEARTBEAT_MS)
    this.heartbeat.unref?.()
  }

  private touch(): void {
    if (this.filePath === undefined) return
    try {
      const now = new Date()
      this.modules.fs.utimesSync(this.filePath, now, now)
    } catch (error) {
      if (errorCode(error) === FILE_NOT_FOUND) this.replaceFile()
    }
  }

  private replaceFile(): void {
    const previous = this.filePath
    this.closeDescriptor()
    if (!this.append(this.pendingEvents())) return
    if (previous === undefined) return
    try {
      this.modules.fs.unlinkSync(previous)
    } catch {
      return
    }
  }

  private discardFile(): void {
    const previous = this.filePath
    this.closeDescriptor()
    if (previous === undefined) return
    try {
      this.modules.fs.unlinkSync(previous)
    } catch {
      return
    }
  }

  private closeDescriptor(): void {
    if (this.descriptor !== undefined) {
      try {
        this.modules.fs.closeSync(this.descriptor)
      } catch {
        this.descriptor = undefined
      }
    }
    this.descriptor = undefined
    this.filePath = undefined
  }
}
