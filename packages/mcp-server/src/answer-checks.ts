import { HimringApiError, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { describeIssues, type SchemaCheck, schemaCheckOf } from './tool-schema.js'

export type AnswerCheck = (answer: unknown) => unknown

export function answerCheckOf(id: HimringOperationId): AnswerCheck {
  const schema = HIMRING_OPERATION_CATALOGUE[id].outputSchema
  const check: SchemaCheck | undefined = schema === null ? undefined : schemaCheckOf(schema)
  return answer => {
    const issues = check?.(answer)
    if (issues === undefined) return answer
    throw new HimringApiError(
      'invalid_response',
      `The API answered ${id} with a body that breaks its documented schema. ${describeIssues(issues)} Check that HIMRING_API_URL points at the Himring API.`,
    )
  }
}
