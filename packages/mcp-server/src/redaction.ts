import { Writable } from 'node:stream'

const REDACTED_CREDENTIAL = '[redacted credential]'

export interface Redaction {
  text(value: string): string
  output(target: NodeJS.WritableStream): Writable
}

function replacedIn(value: string, secret: string | undefined): string {
  return secret === undefined || secret.length === 0 ? value : value.replaceAll(secret, REDACTED_CREDENTIAL)
}

export function redactionOf(credential: string | undefined): Redaction {
  const inJson = credential === undefined ? undefined : JSON.stringify(credential).slice(1, -1)
  return {
    text: value => replacedIn(value, credential),
    output: target =>
      new Writable({
        decodeStrings: false,
        write(chunk: unknown, _encoding, callback) {
          const text =
            typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
          target.write(replacedIn(text, inJson), error => callback(error ?? null))
        },
      }),
  }
}
