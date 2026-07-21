// pos 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface posData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface posListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface posListResponse {
    data: posData[]
    total: number
    page: number
    pageSize: number
}

export interface posResponse {
    data: posData
    message: string
    success: boolean
}

export interface posCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface posUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 pos 列表
 */
export const getposList = (params?: posListParams): Promise<posListResponse> => {
    return http.get('/pos', { params })
}

/**
 * 获取 pos 详情
 */
export const getposDetail = (id: number): Promise<posResponse> => {
    return http.get(/ pos/\)
}

/**
 * 创建 pos
 */
export const createpos = (data: posCreateParams): Promise<posResponse> => {
    return http.post('/pos', data)
}

/**
 * 更新 pos
 */
export const updatepos = (id: number, data: posUpdateParams): Promise<posResponse> => {
    return http.put(/ pos/\, data)
}

/**
 * 删除 pos
 */
export const deletepos = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ pos/\)
}

/**
 * 批量删除 pos
 */
export const batchDeletepos = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/pos/batch-delete', { ids })
}

/**
 * 更新 pos 状态
 */
export const updateposStatus = (id: number, status: string): Promise<posResponse> => {
    return http.put(/ pos/\/status, { status })
}

/**
 * 导出 pos 数据
 */
export const exportpos = (params?: posListParams): Promise<Blob> => {
    return http.get('/pos/export', { params, responseType: 'blob' })
}

/**
 * 获取 pos 统计信息
 */
export const getposStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/pos/stats')
}
