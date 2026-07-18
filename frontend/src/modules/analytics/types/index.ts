/**
 * @module analytics/types
 * @description Analytics 类型定义
 */

export interface Analytics {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface AnalyticsListParams {
  page?: number
  limit?: number
  keyword?: string
  status?: string
}
