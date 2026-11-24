import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { MemoryWebhookRejected, verifyMemoryWebhook } from '../src/index.js'
import { idOf, refusalOf } from './support/harness.js'

const SECRET = 'whsec_contract_test_secret_value'
const TOLERANCE_SECONDS = 300
const NOW = new Date('2026-11-24T09:00:00.000Z')
const NOW_SECONDS = Math.floor(NOW.getTime() / 1_000)

const EVENT = {
  id: idOf('evt'),
  type: 'memory.decision.applied',
  created_at: NOW.toISOString(),
  project_id: idOf('prj'),
  memory_id: idOf('mem'),
  decision: { id: idOf('dec'), memory_id: idOf('mem'), kind: 'remember' },
}
const BODY = JSON.stringify(EVENT)

function signatureOf(secret: string, timestamp: number, body: string): string {
  return `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`
}

async function rejectionOf(body: string | Uint8Array, signature: string | null): Promise<string | undefined> {
  const error = await refusalOf(
    verifyMemoryWebhook({ body, signature, secret: SECRET, toleranceSeconds: TOLERANCE_SECONDS, now: NOW }),
  )
  return error instanceof MemoryWebhookRejected ? error.reason : undefined
}

describe('memory webhook verification', () => {
  it('accepts a body that Himring signed with the secret', async () => {
    const event = await verifyMemoryWebhook({
      body: new TextEncoder().encode(BODY),
      signature: signatureOf(SECRET, NOW_SECONDS, BODY),
      secret: SECRET,
      now: NOW,
    })
    expect(event).toEqual(EVENT)
  })

  it.each([
    ['one changed character', BODY.replace('remember', 'rememBer')],
    ['an added space', `${BODY} `],
    ['another event', JSON.stringify({ ...EVENT, project_id: idOf('prj') })],
    ['an empty body', ''],
  ])('rejects a body with %s', async (_label, body) => {
    expect(await rejectionOf(body, signatureOf(SECRET, NOW_SECONDS, BODY))).toBe('signature_invalid')
  })

  it.each([
    ['another secret', signatureOf('whsec_someone_else', NOW_SECONDS, BODY)],
    ['the secret with a changed case', signatureOf(SECRET.toUpperCase(), NOW_SECONDS, BODY)],
    [
      'a timestamp moved after signing',
      signatureOf(SECRET, NOW_SECONDS, BODY).replace(`t=${NOW_SECONDS}`, `t=${NOW_SECONDS + 1}`),
    ],
    ['no digest', `t=${NOW_SECONDS}`],
    ['no timestamp', signatureOf(SECRET, NOW_SECONDS, BODY).replace(`t=${NOW_SECONDS},`, '')],
    ['two timestamps', `t=${NOW_SECONDS - 600},${signatureOf(SECRET, NOW_SECONDS, BODY)}`],
    ['a digest in upper case', signatureOf(SECRET, NOW_SECONDS, BODY).toUpperCase()],
    ['an unknown scheme', signatureOf(SECRET, NOW_SECONDS, BODY).replace('v1=', 'v0=')],
  ])('rejects a signature made with %s', async (_label, signature) => {
    expect(await rejectionOf(BODY, signature)).toBe('signature_invalid')
  })

  it.each([null, '', '   '])('rejects the missing signature %j', async signature => {
    expect(await rejectionOf(BODY, signature)).toBe('signature_missing')
  })

  it.each([
    ['stale', NOW_SECONDS - TOLERANCE_SECONDS - 1],
    ['future', NOW_SECONDS + TOLERANCE_SECONDS + 1],
    ['ancient', 0],
  ])('rejects a %s timestamp even when the signature matches', async (_label, timestamp) => {
    expect(await rejectionOf(BODY, signatureOf(SECRET, timestamp, BODY))).toBe('timestamp_outside_tolerance')
  })

  it.each([NOW_SECONDS - TOLERANCE_SECONDS, NOW_SECONDS + TOLERANCE_SECONDS])(
    'accepts the timestamp %i at the edge of the tolerance',
    async timestamp => {
      const event = await verifyMemoryWebhook({
        body: BODY,
        signature: signatureOf(SECRET, timestamp, BODY),
        secret: SECRET,
        toleranceSeconds: TOLERANCE_SECONDS,
        now: NOW,
      })
      expect(event.id).toBe(EVENT.id)
    },
  )

  it('rejects a signed body that is not a memory event', async () => {
    const body = JSON.stringify({ id: EVENT.id })
    expect(await rejectionOf(body, signatureOf(SECRET, NOW_SECONDS, body))).toBe('event_invalid')
  })
})
