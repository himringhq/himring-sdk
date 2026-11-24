import * as v from 'valibot'
import type { ListMemoryDecisionsOutput } from '../generated/types.js'

export const MEMORY_WEBHOOK_REJECTIONS = [
  'signature_missing',
  'signature_invalid',
  'timestamp_outside_tolerance',
  'event_invalid',
] as const

export type MemoryWebhookRejection = (typeof MEMORY_WEBHOOK_REJECTIONS)[number]

export const MEMORY_WEBHOOK_SIGNATURE_HEADER = 'himring-signature'
export const MEMORY_WEBHOOK_EVENT_ID_HEADER = 'himring-event-id'
export const DEFAULT_MEMORY_WEBHOOK_TOLERANCE_SECONDS = 300

type AppliedDecision = ListMemoryDecisionsOutput['decisions'][number]

export interface MemoryWebhookEvent {
  id: string
  type: string
  created_at: string
  project_id: string
  memory_id: string
  decision: Omit<AppliedDecision, 'overridden_at'>
}

export class MemoryWebhookRejected extends Error {
  readonly reason: MemoryWebhookRejection

  constructor(reason: MemoryWebhookRejection, message: string) {
    super(message)
    this.name = 'MemoryWebhookRejected'
    this.reason = reason
  }
}

export interface ReceivedMemoryWebhook {
  body: string | Uint8Array
  signature: string | null | undefined
  secret: string
  toleranceSeconds?: number
  now?: Date
}

const SIGNATURE_VERSION = 'v1'
const SIGNATURE_HEADER_MAXIMUM_LENGTH = 4_096
const HEX_DIGEST = /^[0-9a-f]{64}$/
const UNIX_SECONDS = /^\d{1,12}$/
const MILLISECONDS_PER_SECOND = 1_000

const eventEnvelopeSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  type: v.pipe(v.string(), v.nonEmpty()),
  created_at: v.string(),
  project_id: v.string(),
  memory_id: v.string(),
  decision: v.looseObject({ id: v.string(), memory_id: v.string(), kind: v.string() }),
})

interface SignedParts {
  timestamp: number
  digests: Uint8Array<ArrayBuffer>[]
}

function digestBytesOf(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

function signedPartsOf(header: string): SignedParts | undefined {
  if (header.length > SIGNATURE_HEADER_MAXIMUM_LENGTH) return undefined
  let timestamp: number | undefined
  const digests: Uint8Array<ArrayBuffer>[] = []
  for (const part of header.split(',')) {
    const separator = part.indexOf('=')
    if (separator <= 0) continue
    const key = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (key === 't') {
      if (timestamp !== undefined || !UNIX_SECONDS.test(value)) return undefined
      timestamp = Number(value)
    } else if (key === SIGNATURE_VERSION && HEX_DIGEST.test(value)) {
      digests.push(digestBytesOf(value))
    }
  }
  if (timestamp === undefined || digests.length === 0) return undefined
  return { timestamp, digests }
}

function signedBytesOf(timestamp: number, body: string | Uint8Array): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const prefix = encoder.encode(`${timestamp}.`)
  const content = typeof body === 'string' ? encoder.encode(body) : body
  const signed = new Uint8Array(prefix.byteLength + content.byteLength)
  signed.set(prefix, 0)
  signed.set(content, prefix.byteLength)
  return signed
}

async function signedByHimring(parts: SignedParts, received: ReceivedMemoryWebhook): Promise<boolean> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(received.secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const signed = signedBytesOf(parts.timestamp, received.body)
  for (const digest of parts.digests) {
    if (await globalThis.crypto.subtle.verify('HMAC', key, digest, signed)) return true
  }
  return false
}

function bodyTextOf(body: string | Uint8Array): string {
  try {
    return typeof body === 'string' ? body : new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch {
    throw new MemoryWebhookRejected('event_invalid', 'The body is not UTF-8 text.')
  }
}

function isMemoryWebhookEvent(value: unknown): value is MemoryWebhookEvent {
  return v.is(eventEnvelopeSchema, value)
}

function parsedEvent(body: string | Uint8Array): MemoryWebhookEvent {
  let json: unknown
  try {
    json = JSON.parse(bodyTextOf(body))
  } catch (error) {
    if (error instanceof MemoryWebhookRejected) throw error
    throw new MemoryWebhookRejected('event_invalid', 'The body is not JSON.')
  }
  if (!isMemoryWebhookEvent(json)) {
    throw new MemoryWebhookRejected('event_invalid', 'The body is not a Memory webhook event.')
  }
  return json
}

export async function verifyMemoryWebhook(received: ReceivedMemoryWebhook): Promise<MemoryWebhookEvent> {
  const toleranceSeconds = received.toleranceSeconds ?? DEFAULT_MEMORY_WEBHOOK_TOLERANCE_SECONDS
  if (!Number.isFinite(toleranceSeconds) || toleranceSeconds <= 0) {
    throw new RangeError('Set toleranceSeconds to a number of seconds above 0.')
  }
  if (typeof received.secret !== 'string' || received.secret.length === 0) {
    throw new RangeError('Pass the signing secret of the webhook.')
  }
  const header = received.signature ?? ''
  if (header.trim().length === 0) {
    throw new MemoryWebhookRejected('signature_missing', 'The request carries no himring-signature header.')
  }
  const parts = signedPartsOf(header)
  if (parts === undefined || !(await signedByHimring(parts, received))) {
    throw new MemoryWebhookRejected('signature_invalid', 'The signature does not match the body and the secret.')
  }
  const nowSeconds = Math.floor((received.now ?? new Date()).getTime() / MILLISECONDS_PER_SECOND)
  if (!Number.isFinite(nowSeconds) || Math.abs(nowSeconds - parts.timestamp) > toleranceSeconds) {
    throw new MemoryWebhookRejected(
      'timestamp_outside_tolerance',
      `Himring signed the request more than ${toleranceSeconds} seconds away from now.`,
    )
  }
  return parsedEvent(received.body)
}
