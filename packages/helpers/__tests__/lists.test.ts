import { List, Map } from "immutable"

import * as helpers from ".."

describe("lists helpers", () => {
  describe("chunkList", () => {
    it("chunks a list correctly", () => {
      const a = List<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      const b = helpers.chunkList(a, 3)

      expect(List.isList(b)).toBeTruthy()
      expect(b.size).toEqual(4)

      expect(b.get(0)).toBeDefined()
      expect(List.isList(b.get(0))).toBeTruthy()
      expect((b.get(0) as List<number>).toArray()).toEqual([1, 2, 3])

      expect(b.get(1)).toBeDefined()
      expect(List.isList(b.get(1))).toBeTruthy()
      expect((b.get(1) as List<number>).toArray()).toEqual([4, 5, 6])

      expect(b.get(2)).toBeDefined()
      expect(List.isList(b.get(2))).toBeTruthy()
      expect((b.get(2) as List<number>).toArray()).toEqual([7, 8, 9])

      expect(b.get(3)).toBeDefined()
      expect(List.isList(b.get(3))).toBeTruthy()
      expect((b.get(3) as List<number>).toArray()).toEqual([10])

      expect(b.get(4)).toBeUndefined()
    })
  })

  describe("classifyList", () => {
    it("classifies a list correctly", () => {
      const a = List<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      const b = helpers.classifyList<number, number>(a, v => v % 3)

      expect(Map.isMap(b)).toBeTruthy()
      expect(b.size).toEqual(3)
      expect(b.keys()).toContain(0)
      expect(b.keys()).toContain(1)
      expect(b.keys()).toContain(2)

      expect(List.isList(b.get(0))).toBeTruthy()
      expect((b.get(0) as List<number>).toArray()).toEqual([3, 6, 9])

      expect(List.isList(b.get(1))).toBeTruthy()
      expect((b.get(1) as List<number>).toArray()).toEqual([1, 4, 7, 10])

      expect(List.isList(b.get(2))).toBeTruthy()
      expect((b.get(2) as List<number>).toArray()).toEqual([2, 5, 8, 11])
    })
  })
})
