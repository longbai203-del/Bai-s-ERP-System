/**
 * @module saas/types
 * @description Saas 类型定义
 */

export interface Saas {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface SaasListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
