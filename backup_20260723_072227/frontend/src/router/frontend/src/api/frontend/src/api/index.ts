export * from './client'

// 自动导入所有模块API
const modules = import.meta.glob('../modules/*/api/index.ts', { eager: true })
const apiModules = {}

Object.keys(modules).forEach((key) => {
  const moduleName = key.split('/')[2]
  const module = modules[key] as any
  if (module) {
    apiModules[moduleName] = module
  }
})

export const api = apiModules
