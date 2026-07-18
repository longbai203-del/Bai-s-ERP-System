/**
 * @module marketing/types
 * @description Marketing 类型定义
 */

export interface Marketing {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface MarketingListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
