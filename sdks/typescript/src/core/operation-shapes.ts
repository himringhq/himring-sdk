import { HIMRING_OPERATION_SHAPES, HIMRING_SHAPES } from '../generated/shapes.js'
import { HimringApiError, invalidInput } from './errors.js'
import { type HimringOperationShapes, placeOf, shapeProblemOf } from './shape-check.js'

const SHAPES_OF_OPERATION: ReadonlyMap<string, HimringOperationShapes> = new Map(
  Object.entries(HIMRING_OPERATION_SHAPES),
)

function shapesOf(id: string): HimringOperationShapes {
  const shapes = SHAPES_OF_OPERATION.get(id)
  if (shapes === undefined) throw invalidInput(`The API has no operation called ${id}.`, undefined)
  return shapes
}

export function checkedInput(id: string, input: Readonly<Record<string, unknown>>): void {
  const problem = shapeProblemOf(HIMRING_SHAPES, shapesOf(id).input, input)
  if (problem === undefined) return
  const message = `The input of ${id} has ${placeOf(problem.path)}, which ${problem.message}.`
  throw new HimringApiError('invalid_input', message, { issues: [{ message, path: problem.path }] })
}

export function checkedOutput(id: string, output: unknown, status: number, requestId: string | undefined): unknown {
  const index = shapesOf(id).output
  if (index === null) return output
  const problem = shapeProblemOf(HIMRING_SHAPES, index, output)
  if (problem === undefined) return output
  throw new HimringApiError(
    'invalid_response',
    `The API answered ${id} with ${placeOf(problem.path)}, which ${problem.message}. Check that the address points at the Himring API and that the SDK is up to date.`,
    { status, requestId, issues: [{ message: problem.message, path: problem.path }] },
  )
}
