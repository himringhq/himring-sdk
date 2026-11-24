import type { CliIo } from './output.js'
import { printable } from './text-cells.js'

export function secretOutput(io: CliIo) {
  const secrets = new Set<string>()

  function protectSecret(value: string | undefined): void {
    if (value === undefined || value.length === 0) return
    secrets.add(value)
    secrets.add(JSON.stringify(value).slice(1, -1))
    secrets.add(printable(value, false))
    secrets.add(printable(value, true))
  }

  function redact(text: string): string {
    let result = text
    for (const secret of [...secrets].sort((left, right) => right.length - left.length)) {
      result = result.replaceAll(secret, '[redacted credential]')
    }
    return result
  }

  function redactValue(value: unknown): unknown {
    if (typeof value === 'string') return redact(value)
    if (Array.isArray(value)) return value.map(redactValue)
    if (typeof value !== 'object' || value === null) return value
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [redact(key), redactValue(entry)]))
  }

  function redactOutput(text: string): string {
    try {
      const value: unknown = JSON.parse(text)
      return `${JSON.stringify(redactValue(value))}${text.endsWith('\n') ? '\n' : ''}`
    } catch {
      return redact(text)
    }
  }

  return {
    protectSecret,
    io: {
      writeStdout: (text: string) => io.writeStdout(redactOutput(text)),
      writeStderr: (text: string) => io.writeStderr(redactOutput(text)),
      readStdin: () => io.readStdin(),
      stdinIsTerminal: io.stdinIsTerminal,
    },
  }
}
