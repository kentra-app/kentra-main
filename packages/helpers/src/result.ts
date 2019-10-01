export interface Ok<T> {
  kind: "ok"
  value: T
}

export const ok = <T>(value: T): Ok<T> => ({
  kind: "ok",
  value,
})

export const isOk = (data: any): data is Ok<any> =>
  data.kind === "ok" && data.value !== undefined

export interface Error<E> {
  kind: "error"
  value: E
}

export const error = <E>(value: E): Error<E> => ({
  kind: "error",
  value,
})

export const isError = (data: any): data is Error<any> =>
  data.kind === "error" && data.value !== undefined

export type Result<T, E> = Ok<T> | Error<E>

export const isResult = (data: any): data is Result<any, any> =>
  isOk(data) || isError(data)
