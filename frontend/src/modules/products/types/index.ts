/**
 * @module products/types
 * @description Products 类型定义
 */

export interface Products {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface ProductsListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
