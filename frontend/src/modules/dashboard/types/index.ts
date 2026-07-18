/**
 * @module dashboard/types
 * @description Dashboard 类型定义
 */

export interface Dashboard {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface DashboardListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
