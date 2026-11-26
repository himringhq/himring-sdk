import { resolve } from 'node:path'
import { loadSpecModel } from '../../sdks/typescript/codegen/spec-model.ts'
import { commandsOf } from './cli-help.mjs'

const [released, candidate, directory, releasedSpec] = process.argv.slice(2)
if (!released || !candidate || !directory || !releasedSpec)
  throw new Error(
    'Pass the released CLI, the candidate CLI, the candidate spec directory, and the released spec directory.',
  )

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
