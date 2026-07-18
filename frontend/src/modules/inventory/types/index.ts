/**
 * @module inventory/types
 * @description Inventory 类型定义
 */

export interface Inventory {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface InventoryListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
