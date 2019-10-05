import { promises as fs } from "fs"
import { Map } from "immutable"
import * as path from "path"

export const configFileName = "kentra.json"

export interface RawConfig {
  plugins: RawDependencies
  additionalDependencies?: RawDependencies
}

export const emptyRawConfig = (): RawConfig => ({
  plugins: emptyRawDependencies(),
})
export const isRawConfig = (data: any): data is RawConfig =>
  data.plugins !== undefined &&
  isRawDependencies(data.plugins) &&
  (data.additionalDependencies === undefined ||
    isRawDependencies(data.additionalDependencies))

export interface Config {
  plugins: Dependencies
  additionalDependencies?: Dependencies
}

export const emptyConfig = (): Config => ({ plugins: emptyDependencies() })
export const isConfig = (data: any): data is Config =>
  data.plugins !== undefined &&
  isDependencies(data.plugins) &&
  (data.additionalDependencies === undefined ||
    isDependencies(data.additionalDependencies))

export const parseConfig = (data: RawConfig): Config => ({
  plugins: parseDependencies(data.plugins),
  ...(data.additionalDependencies
    ? { additionalDependencies: parseDependencies(data.additionalDependencies) }
    : {}),
})

export interface RawDependencies {
  [d: string]: string
}

export const emptyRawDependencies = (): RawDependencies => ({})
export const isRawDependencies = (data: any): data is Dependencies =>
  Object.getOwnPropertyNames(data).every(
    (property: string) =>
      data[property] !== undefined && typeof data[property] === "string"
  )

export type Dependencies = Map<string, string>

export const emptyDependencies = (): Dependencies => Map<string, string>()
export const isDependencies = (data: any): data is Dependencies =>
  Map.isMap(data) &&
  data
    .entrySeq()
    .every(
      ([key, value]) => typeof key === "string" && typeof value === "string"
    )

export const parseDependencies = (
  dependencies: RawDependencies
): Dependencies =>
  Object.getOwnPropertyNames(dependencies).reduce<Dependencies>(
    (memo: Dependencies, name: string) => memo.set(name, dependencies[name]),
    Map()
  )

export const readConfigFile = (filePath: string): Promise<Config> =>
  fs
    .readFile(filePath)
    .then<string>(buffer => buffer.toString())
    .then<any>(data => JSON.parse(data))
    .then(data =>
      isRawConfig(data)
        ? Promise.resolve<Config>(parseConfig(data))
        : Promise.reject<Config>("Not config")
    )

export const getPluginConfig = (name: string): Promise<Config> =>
  new Promise<string>((resolve, _) => {
    let packagePath = require.resolve(`${name}/package.json`)
    let packageDir = path.dirname(packagePath)
    let configPath = path.join(packageDir, configFileName)

    resolve(configPath)
  }).then<Config>(readConfigFile)
