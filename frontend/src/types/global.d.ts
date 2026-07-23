declare global {
  interface Window {
    __APP_VERSION__: string
    __BUILD_TIME__: string
  }
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface PageParams {
  page: number
  pageSize: number
  total?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    keepAlive?: boolean
    breadcrumb?: boolean
    activeMenu?: string
  }
}

export {}
