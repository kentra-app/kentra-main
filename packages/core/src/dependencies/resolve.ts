import { Map, OrderedSet, Set } from "immutable"

import * as helpers from "@kentra/helpers"

import { SimpleDependenciesGraph } from "./types"

export interface ResolverState {
  error: false | string
  resolved: OrderedSet<string>
  unresolved: OrderedSet<string>
}

export const emptyResolverState = (): ResolverState => ({
  error: false,
  resolved: OrderedSet(),
  unresolved: OrderedSet(),
})

// Implementation of https://www.electricmonk.nl/docs/dependency_resolving_algorithm/dependency_resolving_algorithm.html
export const internalDependencyResolver = (
  graph: SimpleDependenciesGraph,
  node: string,
  initialState: ResolverState
): ResolverState =>
  !graph.has(node)
    ? {
        // Error state, because node is not found
        ...initialState,
        error: `Node '${node}' not found`,
      }
    : ((state: ResolverState): ResolverState =>
        state.error
          ? {
              // Pass through error state, and skip handling of resolved and unresolved
              ...state,
            }
          : {
              // Move the current node from unresolved to resolved
              ...state,
              resolved: state.resolved.add(node),
              unresolved: state.unresolved.remove(node),
            })(
        (graph.get(node) as Set<string>).reduce<ResolverState>(
          (state, dependency) =>
            state.error || state.resolved.includes(dependency)
              ? state // Return state if error or already resolved
              : state.unresolved.includes(dependency)
              ? { ...state, error: `Loop detected involving node '${node}'` } // Return error if loop detected
              : internalDependencyResolver(graph, dependency, state),
          {
            // Add the current node to the unresolved list
            ...initialState,
            unresolved: initialState.unresolved.add(node),
          }
        )
      )

export const resolveDependencies = (
  graph: SimpleDependenciesGraph,
  node: string
): helpers.Result<OrderedSet<string>, string> => {
  const internalResult = internalDependencyResolver(
    graph,
    node,
    emptyResolverState()
  )

  if (internalResult.error) {
    return helpers.error(internalResult.error)
  }

  return helpers.ok(internalResult.resolved)
}
