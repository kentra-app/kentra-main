import { List, Map, OrderedSet, Set } from "immutable"
import { Dependencies, emptyDependencies } from "./config"

export type DependenciesGraph = Map<string, Dependencies>
export type SimpleDependenciesGraph = Map<string, Set<string>>
export type DependenciesVersions = Map<string, Set<string>>

export const mergeDepedencies = (
  ...dependencies: Dependencies[]
): Dependencies =>
  dependencies.reduce((a, b) => ({ ...a, ...b }), emptyDependencies())

const getDependenciesVersionsFromDependencies = (
  dependencies: Dependencies
): DependenciesVersions => dependencies.map<Set<string>>(v => Set([v]))

const mergeDependenciesVersions = (
  ...versionsList: DependenciesVersions[]
): DependenciesVersions =>
  versionsList.reduce<DependenciesVersions>(
    (memo: DependenciesVersions, versions: DependenciesVersions) =>
      memo.mergeWith((a, b) => a.merge(b), versions),
    Map()
  )

export const getDependenciesVersionsFromGraph = (
  graph: DependenciesGraph
): DependenciesVersions =>
  mergeDependenciesVersions(
    ...Array.from(graph.values()).map(getDependenciesVersionsFromDependencies)
  )

export interface ResolverState {
  error: boolean
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
        error: true,
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
              ? { ...state, error: true } // Return error if loop detected
              : internalDependencyResolver(graph, dependency, state),
          {
            // Add the current node to the unresolved list
            ...initialState,
            unresolved: initialState.unresolved.add(node),
          }
        )
      )

// export const resolveDependencies = (graph: SimpleDependenciesGraph):
