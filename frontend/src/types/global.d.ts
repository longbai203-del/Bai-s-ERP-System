/**
 * @file global.d.ts
 * @description 全局类型定义
 */

/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// API 响应类型
declare namespace Api {
  interface Response<T = any> {
    success: boolean
    data: T
    message?: string
    code?: number
    timestamp: string
  }

  interface PaginationResponse<T = any> {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
    timestamp: string
  }

  interface ErrorResponse {
    success: false
    message: string
    code: number
    details?: any
    timestamp: string
  }
}

// 全局窗口扩展
interface Window {
  __APP_VERSION__: string
  __BUILD_TIME__: string
}

// 模块类型
declare namespace Modules {
  interface Module {
    id: string
    name: string
    icon: string
    path: string
    component: () => Promise<any>
    meta: {
      title: string
      requiresAuth: boolean
      permissions?: string[]
    }
  }
}
