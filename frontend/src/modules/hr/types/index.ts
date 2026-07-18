/**
 * @module hr/types
 * @description Hr 类型定义
 */

export interface Hr {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface HrListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
