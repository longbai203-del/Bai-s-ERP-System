// orders 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface ordersData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface ordersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface ordersListResponse {
    data: ordersData[]
    total: number
    page: number
    pageSize: number
}

export interface ordersResponse {
    data: ordersData
    message: string
    success: boolean
}

export interface ordersCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface ordersUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 orders 列表
 */
export const getordersList = (params?: ordersListParams): Promise<ordersListResponse> => {
    return http.get('/orders', { params })
}

/**
 * 获取 orders 详情
 */
export const getordersDetail = (id: number): Promise<ordersResponse> => {
    return http.get(/ orders/\)
}

/**
 * 创建 orders
 */
export const createorders = (data: ordersCreateParams): Promise<ordersResponse> => {
    return http.post('/orders', data)
}

/**
 * 更新 orders
 */
export const updateorders = (id: number, data: ordersUpdateParams): Promise<ordersResponse> => {
    return http.put(/ orders/\, data)
}

/**
 * 删除 orders
 */
export const deleteorders = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ orders/\)
}

/**
 * 批量删除 orders
 */
export const batchDeleteorders = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/orders/batch-delete', { ids })
}

/**
 * 更新 orders 状态
 */
export const updateordersStatus = (id: number, status: string): Promise<ordersResponse> => {
    return http.put(/ orders/\/status, { status })
}

/**
 * 导出 orders 数据
 */
export const exportorders = (params?: ordersListParams): Promise<Blob> => {
    return http.get('/orders/export', { params, responseType: 'blob' })
}

/**
 * 获取 orders 统计信息
 */
export const getordersStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/orders/stats')
}
