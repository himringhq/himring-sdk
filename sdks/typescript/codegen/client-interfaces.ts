import { readFileSync } from 'node:fs'

export interface ClientInterfaces {
  cli: { command: string; confirm?: true; workflow?: true } | null
  mcp: boolean
}

const COMMAND = /^[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)+$/
const legacy: unknown = JSON.parse(readFileSync(new URL('./compatibility/openapi-0.2.1.json', import.meta.url), 'utf8'))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function clientInterfacesOf(
  id: string,
  operation: Record<string, unknown>,
  released: boolean,
): ClientInterfaces {
  const entry =
    released && isRecord(legacy) ? legacy[id] : { cli: operation['x-himring-cli'], mcp: operation['x-himring-mcp'] }
  if (!isRecord(entry) || typeof entry.mcp !== 'boolean') throw new Error(`Missing MCP exposure for ${id}.`)
  const cli = entry.cli
  if (cli === null) return { cli, mcp: entry.mcp }
  if (
    !isRecord(cli) ||
    typeof cli.command !== 'string' ||
    !COMMAND.test(cli.command) ||
    (cli.workflow !== undefined && cli.workflow !== true) ||
    (cli.confirm !== undefined && cli.confirm !== true)
  ) {
    throw new Error(`Invalid CLI command for ${id}.`)
  }
  return {
    cli: {
      command: cli.command,
      ...(cli.confirm === true && { confirm: true }),
      ...(cli.workflow === true && { workflow: true }),
    },
    mcp: entry.mcp,
  }
}
