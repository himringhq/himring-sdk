export class UsageError extends Error {
  readonly suggestion: string

  constructor(message: string, suggestion: string) {
    super(message)
    this.name = 'UsageError'
    this.suggestion = suggestion
  }
}
