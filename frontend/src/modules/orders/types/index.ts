/**
 * @module orders/types
 * @description Orders 类型定义
 */

export interface Orders {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface OrdersListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
