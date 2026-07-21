// purchase 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface purchaseData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface purchaseListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface purchaseListResponse {
    data: purchaseData[]
    total: number
    page: number
    pageSize: number
}

export interface purchaseResponse {
    data: purchaseData
    message: string
    success: boolean
}

export interface purchaseCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface purchaseUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 purchase 列表
 */
export const getpurchaseList = (params?: purchaseListParams): Promise<purchaseListResponse> => {
    return http.get('/purchase', { params })
}

/**
 * 获取 purchase 详情
 */
export const getpurchaseDetail = (id: number): Promise<purchaseResponse> => {
    return http.get(/ purchase/\)
}

/**
 * 创建 purchase
 */
export const createpurchase = (data: purchaseCreateParams): Promise<purchaseResponse> => {
    return http.post('/purchase', data)
}

/**
 * 更新 purchase
 */
export const updatepurchase = (id: number, data: purchaseUpdateParams): Promise<purchaseResponse> => {
    return http.put(/ purchase/\, data)
}

/**
 * 删除 purchase
 */
export const deletepurchase = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ purchase/\)
}

/**
 * 批量删除 purchase
 */
export const batchDeletepurchase = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/purchase/batch-delete', { ids })
}

/**
 * 更新 purchase 状态
 */
export const updatepurchaseStatus = (id: number, status: string): Promise<purchaseResponse> => {
    return http.put(/ purchase/\/status, { status })
}

/**
 * 导出 purchase 数据
 */
export const exportpurchase = (params?: purchaseListParams): Promise<Blob> => {
    return http.get('/purchase/export', { params, responseType: 'blob' })
}

/**
 * 获取 purchase 统计信息
 */
export const getpurchaseStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/purchase/stats')
}
