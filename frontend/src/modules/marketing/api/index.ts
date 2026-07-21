// marketing 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface marketingData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface marketingListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface marketingListResponse {
    data: marketingData[]
    total: number
    page: number
    pageSize: number
}

export interface marketingResponse {
    data: marketingData
    message: string
    success: boolean
}

export interface marketingCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface marketingUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 marketing 列表
 */
export const getmarketingList = (params?: marketingListParams): Promise<marketingListResponse> => {
    return http.get('/marketing', { params })
}

/**
 * 获取 marketing 详情
 */
export const getmarketingDetail = (id: number): Promise<marketingResponse> => {
    return http.get(/ marketing/\)
}

/**
 * 创建 marketing
 */
export const createmarketing = (data: marketingCreateParams): Promise<marketingResponse> => {
    return http.post('/marketing', data)
}

/**
 * 更新 marketing
 */
export const updatemarketing = (id: number, data: marketingUpdateParams): Promise<marketingResponse> => {
    return http.put(/ marketing/\, data)
}

/**
 * 删除 marketing
 */
export const deletemarketing = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ marketing/\)
}

/**
 * 批量删除 marketing
 */
export const batchDeletemarketing = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/marketing/batch-delete', { ids })
}

/**
 * 更新 marketing 状态
 */
export const updatemarketingStatus = (id: number, status: string): Promise<marketingResponse> => {
    return http.put(/ marketing/\/status, { status })
}

/**
 * 导出 marketing 数据
 */
export const exportmarketing = (params?: marketingListParams): Promise<Blob> => {
    return http.get('/marketing/export', { params, responseType: 'blob' })
}

/**
 * 获取 marketing 统计信息
 */
export const getmarketingStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/marketing/stats')
}
