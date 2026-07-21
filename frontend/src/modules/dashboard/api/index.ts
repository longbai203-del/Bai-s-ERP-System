// dashboard 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface dashboardData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface dashboardListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface dashboardListResponse {
    data: dashboardData[]
    total: number
    page: number
    pageSize: number
}

export interface dashboardResponse {
    data: dashboardData
    message: string
    success: boolean
}

export interface dashboardCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface dashboardUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 dashboard 列表
 */
export const getdashboardList = (params?: dashboardListParams): Promise<dashboardListResponse> => {
    return http.get('/dashboard', { params })
}

/**
 * 获取 dashboard 详情
 */
export const getdashboardDetail = (id: number): Promise<dashboardResponse> => {
    return http.get(/ dashboard/\)
}

/**
 * 创建 dashboard
 */
export const createdashboard = (data: dashboardCreateParams): Promise<dashboardResponse> => {
    return http.post('/dashboard', data)
}

/**
 * 更新 dashboard
 */
export const updatedashboard = (id: number, data: dashboardUpdateParams): Promise<dashboardResponse> => {
    return http.put(/ dashboard/\, data)
}

/**
 * 删除 dashboard
 */
export const deletedashboard = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ dashboard/\)
}

/**
 * 批量删除 dashboard
 */
export const batchDeletedashboard = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/dashboard/batch-delete', { ids })
}

/**
 * 更新 dashboard 状态
 */
export const updatedashboardStatus = (id: number, status: string): Promise<dashboardResponse> => {
    return http.put(/ dashboard/\/status, { status })
}

/**
 * 导出 dashboard 数据
 */
export const exportdashboard = (params?: dashboardListParams): Promise<Blob> => {
    return http.get('/dashboard/export', { params, responseType: 'blob' })
}

/**
 * 获取 dashboard 统计信息
 */
export const getdashboardStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/dashboard/stats')
}
