/**
 * @module pos/types
 * @description Pos 类型定义
 */

export interface Pos {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface PosListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
