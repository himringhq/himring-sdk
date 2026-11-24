export function methodNameOf(operationId: string): string {
  return operationId.replace(/_([a-z0-9])/g, (_whole, letter: string) => letter.toUpperCase())
}

export function typeNameOf(operationId: string): string {
  const method = methodNameOf(operationId)
  return `${method.charAt(0).toUpperCase()}${method.slice(1)}`
}

export function inputTypeNameOf(operationId: string): string {
  return `${typeNameOf(operationId)}Input`
}

export function outputTypeNameOf(operationId: string): string {
  return `${typeNameOf(operationId)}Output`
}
