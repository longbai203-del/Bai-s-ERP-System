/**
 * @module finance/types
 * @description Finance 类型定义
 */

export interface Finance {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface FinanceListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
