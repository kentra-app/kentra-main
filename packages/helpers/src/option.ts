export interface Some<T> {
  kind: "some"
  value: T
}

export const some = <T>(value: T): Some<T> => ({
  kind: "some",
  value,
})

export const isSome = (data: any): data is Some<any> =>
  data.kind === "some" && data.value !== undefined

export interface None {
  kind: "none"
}

export const none = (): None => ({ kind: "none" })

export const isNone = (data: any): data is None => data.kind === "none"

export type Option<T> = Some<T> | None

export const isOption = (data: any): data is Option<any> =>
  isSome(data) || isNone(data)
