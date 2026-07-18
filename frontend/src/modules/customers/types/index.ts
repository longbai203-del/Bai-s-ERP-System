/**
 * @module customers/types
 * @description Customers 类型定义
 */

export interface Customers {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface CustomersListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
