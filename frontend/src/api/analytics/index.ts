// analytics 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface AnalyticsData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface AnalyticsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface AnalyticsListResponse {
    data: AnalyticsData[]
    total: number
    page: number
    pageSize: number
}

export interface AnalyticsResponse {
    data: AnalyticsData
    message: string
    success: boolean
}

export interface AnalyticsCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface AnalyticsUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 analytics 列表
 */
export const getAnalyticsList = (params?: AnalyticsListParams): Promise<AnalyticsListResponse> => {
    return http.get('/analytics', { params })
}

/**
 * 获取 analytics 详情
 */
export const getAnalyticsDetail = (id: number): Promise<AnalyticsResponse> => {
    return http.get(`/analytics/${id}`)
}

/**
 * 创建 analytics
 */
export const createAnalytics = (data: AnalyticsCreateParams): Promise<AnalyticsResponse> => {
    return http.post('/analytics', data)
}

/**
 * 更新 analytics
 */
export const updateAnalytics = (id: number, data: AnalyticsUpdateParams): Promise<AnalyticsResponse> => {
    return http.put(`/analytics/${id}`, data)
}

/**
 * 删除 analytics
 */
export const deleteAnalytics = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(`/analytics/${id}`)
}

/**
 * 批量删除 analytics
 */
export const batchDeleteAnalytics = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/analytics/batch-delete', { ids })
}

/**
 * 更新 analytics 状态
 */
export const updateAnalyticsStatus = (id: number, status: string): Promise<AnalyticsResponse> => {
    return http.put(`/analytics/${id}/status`, { status })
}

/**
 * 导出 analytics 数据
 */
export const exportAnalytics = (params?: AnalyticsListParams): Promise<Blob> => {
    return http.get('/analytics/export', { params, responseType: 'blob' })
}

/**
 * 获取 analytics 统计信息
 */
export const getAnalyticsStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/analytics/stats')
}
