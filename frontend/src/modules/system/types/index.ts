/**
 * @module system/types
 * @description System 类型定义
 */

export interface System {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface SystemListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
