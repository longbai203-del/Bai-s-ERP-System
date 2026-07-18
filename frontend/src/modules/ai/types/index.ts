/**
 * @module ai/types
 * @description Ai 类型定义
 */

export interface Ai {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface AiListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
