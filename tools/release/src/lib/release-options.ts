import { parseArgs } from 'node:util'

export interface ReleaseOptions {
  command: string | undefined
  project: string
  version: string
  dryRun: boolean
  firstRelease: boolean
}

export function readReleaseOptions(argv: readonly string[]): ReleaseOptions {
  const { values, positionals } = parseArgs({
    args: [...argv],
    allowPositionals: true,
    strict: true,
    options: {
      project: { type: 'string', default: process.env.RELEASE_PROJECT ?? '' },
      version: { type: 'string', default: process.env.VERSION ?? '' },
      'dry-run': { type: 'boolean', default: process.env.DRY_RUN === 'true' },
      'first-release': { type: 'boolean', default: process.env.FIRST_RELEASE === 'true' },
    },
  })
  return {
    command: positionals[0],
    project: values.project,
    version: values.version,
    dryRun: values['dry-run'],
    firstRelease: values['first-release'],
  }
}

export function projectOf<Project>(projects: Readonly<Record<string, Project>>, name: string): Project {
  const project = Object.hasOwn(projects, name) ? projects[name] : undefined
  if (project === undefined) {
    throw new Error(`Pass --project with one of ${Object.keys(projects).join(', ')}.`)
  }
  return project
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
