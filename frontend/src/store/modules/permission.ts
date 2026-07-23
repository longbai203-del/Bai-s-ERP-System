import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const isLoaded = ref(false)
  
  async function generateRoutes(roles: string[]) {
    const modules = import.meta.glob('@/modules/*/router/*.ts', { eager: true })
    const allRoutes: RouteRecordRaw[] = []
    
    Object.keys(modules).forEach((key) => {
      const module = modules[key] as any
      if (module.default) {
        const routes = module.default
        if (Array.isArray(routes)) {
          allRoutes.push(...routes)
        } else {
          allRoutes.push(routes)
        }
      }
    })
    
    const filteredRoutes = filterRoutesByPermission(allRoutes, roles)
    routes.value = filteredRoutes
    isLoaded.value = true
    
    return filteredRoutes
  }
  
  function filterRoutesByPermission(routes: RouteRecordRaw[], roles: string[]) {
    return routes.filter(route => {
      if (route.meta?.roles) {
        return (route.meta.roles as string[]).some(role => roles.includes(role))
      }
      return true
    })
  }
  
  return {
    routes,
    isLoaded,
    generateRoutes
  }
})
