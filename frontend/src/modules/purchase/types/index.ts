/**
 * @module purchase/types
 * @description Purchase 类型定义
 */

export interface Purchase {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface PurchaseListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
