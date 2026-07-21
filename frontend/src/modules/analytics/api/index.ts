// analytics 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface analyticsData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface analyticsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface analyticsListResponse {
    data: analyticsData[]
    total: number
    page: number
    pageSize: number
}

export interface analyticsResponse {
    data: analyticsData
    message: string
    success: boolean
}

export interface analyticsCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface analyticsUpdateParams {
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
export const getanalyticsList = (params?: analyticsListParams): Promise<analyticsListResponse> => {
    return http.get('/analytics', { params })
}

/**
 * 获取 analytics 详情
 */
export const getanalyticsDetail = (id: number): Promise<analyticsResponse> => {
    return http.get(/ analytics/\)
}

/**
 * 创建 analytics
 */
export const createanalytics = (data: analyticsCreateParams): Promise<analyticsResponse> => {
    return http.post('/analytics', data)
}

/**
 * 更新 analytics
 */
export const updateanalytics = (id: number, data: analyticsUpdateParams): Promise<analyticsResponse> => {
    return http.put(/ analytics/\, data)
}

/**
 * 删除 analytics
 */
export const deleteanalytics = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ analytics/\)
}

/**
 * 批量删除 analytics
 */
export const batchDeleteanalytics = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/analytics/batch-delete', { ids })
}

/**
 * 更新 analytics 状态
 */
export const updateanalyticsStatus = (id: number, status: string): Promise<analyticsResponse> => {
    return http.put(/ analytics/\/status, { status })
}

/**
 * 导出 analytics 数据
 */
export const exportanalytics = (params?: analyticsListParams): Promise<Blob> => {
    return http.get('/analytics/export', { params, responseType: 'blob' })
}

/**
 * 获取 analytics 统计信息
 */
export const getanalyticsStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/analytics/stats')
}
