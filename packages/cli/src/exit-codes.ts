import { type HimringApiError, isHimringApiError } from '@himring/sdk'

export const EXIT_CODES = {
  success: 0,
  unexpected: 1,
  usage: 2,
  configuration: 3,
  notFound: 4,
  permissionDenied: 5,
  conflict: 6,
  rateLimited: 7,
  network: 10,
  notReady: 11,
  serverError: 12,
  partialFailure: 13,
} as const

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES]

export const EXIT_CODE_HELP = `
Exit codes:
  0   The command succeeded.
  1   The command failed for an unexpected reason.
  2   The arguments, the input, or the environment were invalid.
  3   The CLI could not read or write its credentials file.
  4   The project, database, index, or other record does not exist.
  5   The credential is missing, invalid, or not allowed to do this.
  6   The change conflicts with the current state, such as a name in use.
  7   The API limited the rate of requests. Wait, then try again.
  10  The CLI could not reach the API, or the API did not respond in time.
  11  The API responded, but a service behind it is not ready.
  12  The API or a service behind it failed. Run the command again after 10 seconds.
  13  Some files of the folder were sent and others failed. Run the upload again to send the rest.`

const HTTP_UNAUTHORIZED = 401
const HTTP_FORBIDDEN = 403
const HTTP_NOT_FOUND = 404
const HTTP_CONFLICT = 409
const HTTP_GONE = 410
const HTTP_TOO_MANY_REQUESTS = 429
const HTTP_SERVER_ERROR = 500

function exitCodeForStatus(status: number | undefined): ExitCode {
  if (status === undefined) return EXIT_CODES.unexpected
  if (status === HTTP_UNAUTHORIZED || status === HTTP_FORBIDDEN) return EXIT_CODES.permissionDenied
  if (status === HTTP_NOT_FOUND) return EXIT_CODES.notFound
  if (status === HTTP_CONFLICT || status === HTTP_GONE) return EXIT_CODES.conflict
  if (status === HTTP_TOO_MANY_REQUESTS) return EXIT_CODES.rateLimited
  if (status >= HTTP_SERVER_ERROR) return EXIT_CODES.serverError
  return EXIT_CODES.usage
}

export function exitCodeForApiError(error: HimringApiError): ExitCode {
  switch (error.kind) {
    case 'network':
    case 'timeout':
      return EXIT_CODES.network
    case 'invalid_input':
      return EXIT_CODES.usage
    case 'invalid_response':
      return EXIT_CODES.unexpected
    case 'refused':
      return exitCodeForStatus(error.status)
  }
}

export function exitCodeForError(error: unknown): ExitCode {
  return isHimringApiError(error) ? exitCodeForApiError(error) : EXIT_CODES.unexpected
}
