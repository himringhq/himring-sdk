import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { loadSpecModel } from '../../sdks/typescript/codegen/spec-model.ts'

const [released, candidate, directory, releasedSpec] = process.argv.slice(2)
if (!released || !candidate || !directory || !releasedSpec)
  throw new Error(
    'Pass the released CLI, the candidate CLI, the candidate spec directory, and the released spec directory.',
  )

function commandsOf(entry) {
  const found = new Map()
  function visit(words) {
    const command = words.join(' ')
    if (found.has(command)) throw new Error(`Duplicate command: ${command}`)
    const help = execFileSync(entry, [...words, '--help'], { encoding: 'utf8', timeout: 20000 })
    const lines = help.split('\n')
    const options = new Set()
    const children = []
    let section = ''
    for (const line of lines) {
      if (/^\S/.test(line)) section = line
      if (section === 'Options:') {
        const flag = /^ {2}(?:-\w, )?(--[\w-]+)(?: (<?[\w-]+>|\[[\w-]+\]))?/.exec(line)
        if (flag) options.add(flag[1] + (flag[2]?.startsWith('<') ? ' value' : flag[2] ? ' optional' : ''))
      }
      if (section === 'Commands:') {
        const child = /^ {2}([a-z][a-z0-9-]*)\b/.exec(line)?.[1]
        if (child && child !== 'help') children.push(child)
      }
    }
    found.set(command, options)
    for (const child of children) visit([...words, child])
  }
  visit([])
  return found
}

const current = commandsOf(resolve(candidate))
for (const [command, flags] of commandsOf(resolve(released))) {
  if (!current.has(command)) throw new Error(`Missing command: ${command}`)
  for (const flag of flags) {
    if (!current.get(command).has(flag)) throw new Error(`The CLI changed or removed ${command} ${flag}.`)
  }
}
const model = loadSpecModel(directory)
const commands = new Map(model.operations.map(op => [op.id, op.cli]))
for (const op of loadSpecModel(releasedSpec).operations) {
  if (op.cli && commands.get(op.id)?.command !== op.cli.command) throw new Error(`Changed the command of ${op.id}.`)
}
const claimed = new Set()
for (const op of model.operations) {
  const cli = op.cli
  if (cli === null) continue
  if (!current.has(cli.command) || claimed.has(cli.command))
    throw new Error(`Missing or duplicate command for ${op.id}.`)
  if (cli.confirm && !current.get(cli.command).has('--yes')) throw new Error(`Missing confirmation for ${op.id}.`)
  claimed.add(cli.command)
}
console.log(`Checked ${claimed.size} operation commands against the built CLI.`)
