// reports 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface reportsData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface reportsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface reportsListResponse {
    data: reportsData[]
    total: number
    page: number
    pageSize: number
}

export interface reportsResponse {
    data: reportsData
    message: string
    success: boolean
}

export interface reportsCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface reportsUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 reports 列表
 */
export const getreportsList = (params?: reportsListParams): Promise<reportsListResponse> => {
    return http.get('/reports', { params })
}

/**
 * 获取 reports 详情
 */
export const getreportsDetail = (id: number): Promise<reportsResponse> => {
    return http.get(/ reports/\)
}

/**
 * 创建 reports
 */
export const createreports = (data: reportsCreateParams): Promise<reportsResponse> => {
    return http.post('/reports', data)
}

/**
 * 更新 reports
 */
export const updatereports = (id: number, data: reportsUpdateParams): Promise<reportsResponse> => {
    return http.put(/ reports/\, data)
}

/**
 * 删除 reports
 */
export const deletereports = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ reports/\)
}

/**
 * 批量删除 reports
 */
export const batchDeletereports = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/reports/batch-delete', { ids })
}

/**
 * 更新 reports 状态
 */
export const updatereportsStatus = (id: number, status: string): Promise<reportsResponse> => {
    return http.put(/ reports/\/status, { status })
}

/**
 * 导出 reports 数据
 */
export const exportreports = (params?: reportsListParams): Promise<Blob> => {
    return http.get('/reports/export', { params, responseType: 'blob' })
}

/**
 * 获取 reports 统计信息
 */
export const getreportsStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/reports/stats')
}
