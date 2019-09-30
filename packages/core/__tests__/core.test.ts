import { Map, Set } from "immutable"
import * as core from ".."

describe("core", () => {
  describe("dependencies", () => {
    it("handles acyclic complete graphs correctly", () => {
      const graph: core.SimpleDependenciesGraph = Map([
        ["a", Set(["b", "d"])],
        ["d", Set()],
        ["b", Set(["c", "e"])],
        ["c", Set(["d"])],
        ["e", Set()],
      ])

      const state = core.depResolve(graph, "a", core.emptyResolveState())

      expect(state.error).toBeFalsy()
      expect(state.unresolved.size).toEqual(0)
      expect(state.resolved.size).toEqual(5)
      expect(state.resolved.toArray()).toEqual(["d", "c", "e", "b", "a"])
    })

    it("handles cyclic complete graphs correctly", () => {
      const graph: core.SimpleDependenciesGraph = Map([
        ["a", Set(["b", "d"])],
        ["d", Set()],
        ["b", Set(["c", "e"])],
        ["c", Set(["d"])],
        ["e", Set(["a"])],
      ])

      const state = core.depResolve(graph, "a", core.emptyResolveState())

      expect(state.error).toBeTruthy()
    })

    it("handles acyclic incomplete graphs correctly", () => {
      const graph: core.SimpleDependenciesGraph = Map([
        ["a", Set(["b", "d"])],
        ["d", Set()],
        ["b", Set(["c", "e"])],
        ["c", Set(["d"])],
      ])

      const state = core.depResolve(graph, "a", core.emptyResolveState())

      expect(state.error).toBeTruthy()
    })
  })
})
