import { List } from "immutable"

import * as helpers from ".."

describe("promises helpers", () => {
  const promiseTester = <T>(
    storage: T[],
    value: T,
    delay: number
  ): helpers.PromiseProvider<T> => () =>
    new Promise<T>((resolve, _) => {
      setTimeout(() => {
        storage.push(value)
        resolve(value)
      }, delay)
    })

  describe("consecutivePromises", () => {
    it("runs promises consecutively", () => {
      expect.assertions(2)

      let storage: number[] = []

      let p = helpers.consecutivePromises<number>(
        List([
          promiseTester(storage, 1, 40),
          promiseTester(storage, 2, 30),
          promiseTester(storage, 3, 20),
          promiseTester(storage, 4, 10),
        ])
      )()

      return p.then((value: List<number>) => {
        expect(value.toArray()).toEqual([1, 2, 3, 4])
        expect(storage).toEqual([1, 2, 3, 4])

        return value
      })
    })
  })

  describe("allPromises", () => {
    it("runs promises at the same time", () => {
      expect.assertions(2)

      let storage: number[] = []

      let p = helpers.allPromises<number>(
        List([
          promiseTester(storage, 1, 40),
          promiseTester(storage, 2, 30),
          promiseTester(storage, 3, 20),
          promiseTester(storage, 4, 10),
        ])
      )()

      return p.then((value: List<number>) => {
        expect(value.toArray()).toEqual([1, 2, 3, 4])
        expect(storage).toEqual([4, 3, 2, 1])

        return value
      })
    })
  })

  describe("chunkedPromises", () => {
    it("runs promises in chunks", () => {
      expect.assertions(2)

      let storage: number[] = []

      let p = helpers.chunkedPromises<number>(
        List([
          promiseTester(storage, 1, 40),
          promiseTester(storage, 2, 30),
          promiseTester(storage, 3, 20),
          promiseTester(storage, 4, 10),
        ]),
        2
      )()

      return p.then((value: List<number>) => {
        expect(value.toArray()).toEqual([1, 2, 3, 4])
        expect(storage).toEqual([2, 1, 4, 3])

        return value
      })
    })
  })
})
