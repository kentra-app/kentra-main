import { Map, Set } from "immutable"

import { Dependencies, emptyDependencies } from "../config"
import {
  DependenciesGraph,
  DependenciesVersions,
  SimpleDependenciesGraph,
} from "./types"

export const mergeDepedencies = (
  ...dependencies: Dependencies[]
): Dependencies =>
  dependencies.reduce<Dependencies>(
    (a: Dependencies, b: Dependencies) => a.merge<string, string>(b),
    emptyDependencies()
  )

const getDependenciesVersionsFromDependencies = (
  dependencies: Dependencies
): DependenciesVersions => dependencies.map<Set<string>>(v => Set([v]))

const mergeDependenciesVersions = (
  ...versionsList: DependenciesVersions[]
): DependenciesVersions =>
  versionsList.reduce<DependenciesVersions>(
    (memo: DependenciesVersions, versions: DependenciesVersions) =>
      memo.mergeWith(
        (a: Set<string>, b: Set<string>) => a.merge<string>(b),
        versions
      ),
    Map()
  )

export const getDependenciesVersionsFromDependenciesGraph = (
  graph: DependenciesGraph
): DependenciesVersions =>
  mergeDependenciesVersions(
    ...Array.from(graph.values()).map<DependenciesVersions>(
      getDependenciesVersionsFromDependencies
    )
  )

export const getSimpleDependenciesGraphFromDependenciesGraph = (
  graph: DependenciesGraph
): SimpleDependenciesGraph =>
  graph.map<Set<string>>((v: Dependencies) => Set<string>(v.keys()))
