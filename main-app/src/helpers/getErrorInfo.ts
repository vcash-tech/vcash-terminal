import { ErrorObj, ErrorObject } from "../types/common/error"

export function getErrorInfo(
  err: unknown,
  defaultCode = "",
  defaultDescription = "Došlo je do greške."
): ErrorObject {
  const errorCode = (err as ErrorObj)?.errors?.at(0)?.code ?? defaultCode
  const errorDescription =
    (err as ErrorObj)?.errors?.at(0)?.description ?? defaultDescription

  return { code: errorCode, description: errorDescription }
}
