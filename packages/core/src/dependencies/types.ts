import { Map, Set } from "immutable"

import { Dependencies } from "../config"

export type DependenciesGraph = Map<string, Dependencies>
export type SimpleDependenciesGraph = Map<string, Set<string>>
export type DependenciesVersions = Map<string, Set<string>>
