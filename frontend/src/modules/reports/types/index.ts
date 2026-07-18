/**
 * @module reports/types
 * @description Reports 类型定义
 */

export interface Reports {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface ReportsListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
