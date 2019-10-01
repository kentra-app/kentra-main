import { List, Map } from "immutable"

export const classifyList = <T, K>(
  list: List<T>,
  classifier: (v: T) => K
): Map<K, List<T>> =>
  list.reduce<Map<K, List<T>>>(
    (m: Map<K, List<T>>, v: T) =>
      m.update(classifier(v), List<T>(), (l: List<T>) => l.push(v)),
    Map<K, List<T>>()
  )

export const validateList = <T>(
  list: List<T>,
  predicate: (value: T) => boolean
): Map<boolean, List<T>> => classifyList<T, boolean>(list, predicate)

export const chunkList = <T>(list: List<T>, chunkSize: number): List<List<T>> =>
  list.reduce<List<List<T>>>(
    (memo: List<List<T>>, value: T, key: number) =>
      key % chunkSize === 0
        ? memo.push(List<T>([value]))
        : memo.update(memo.size - 1, List<T>(), (l: List<T>) => l.push(value)),
    List()
  )

export const unchunkLists = <T>(list: List<List<T>>): List<T> =>
  list.reduce<List<T>>(
    (memo: List<T>, value: List<T>) => memo.concat(value),
    List<T>()
  )
