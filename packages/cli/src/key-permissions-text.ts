import { isKeyPermissions, keyResourceKinds } from './spec-shapes.js'
import { isRecord } from './text-cells.js'

export const KEY_PERMISSION_FIELDS: ReadonlySet<string> = new Set([
  'permissions',
  'permissions_before',
  'permissions_after',
])

const FULL_ACCESS = 'full'
const NO_ACCESS_LEVEL = 'none'
const FULL_ACCESS_TEXT = 'full access'
const NO_PERMISSIONS_TEXT = '-'

function grantText(kind: string, grant: unknown): string[] {
  if (!isRecord(grant) || typeof grant.level !== 'string' || grant.level === NO_ACCESS_LEVEL) return []
  const listed = Array.isArray(grant.resource_ids) ? ` (${grant.resource_ids.length} listed)` : ''
  return [`${kind} ${grant.level}${listed}`]
}

export function keyPermissionsText(value: unknown): string | undefined {
  if (value === null) return NO_PERMISSIONS_TEXT
  if (!isKeyPermissions(value)) return undefined
  if (value.access === FULL_ACCESS) return FULL_ACCESS_TEXT
  const grants = keyResourceKinds().flatMap(kind => grantText(kind, Reflect.get(value, kind)))
  return grants.length === 0 ? NO_PERMISSIONS_TEXT : grants.join(', ')
}
