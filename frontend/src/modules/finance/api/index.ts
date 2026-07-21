// finance 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface financeData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface financeListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface financeListResponse {
    data: financeData[]
    total: number
    page: number
    pageSize: number
}

export interface financeResponse {
    data: financeData
    message: string
    success: boolean
}

export interface financeCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface financeUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 finance 列表
 */
export const getfinanceList = (params?: financeListParams): Promise<financeListResponse> => {
    return http.get('/finance', { params })
}

/**
 * 获取 finance 详情
 */
export const getfinanceDetail = (id: number): Promise<financeResponse> => {
    return http.get(/ finance/\)
}

/**
 * 创建 finance
 */
export const createfinance = (data: financeCreateParams): Promise<financeResponse> => {
    return http.post('/finance', data)
}

/**
 * 更新 finance
 */
export const updatefinance = (id: number, data: financeUpdateParams): Promise<financeResponse> => {
    return http.put(/ finance/\, data)
}

/**
 * 删除 finance
 */
export const deletefinance = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ finance/\)
}

/**
 * 批量删除 finance
 */
export const batchDeletefinance = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/finance/batch-delete', { ids })
}

/**
 * 更新 finance 状态
 */
export const updatefinanceStatus = (id: number, status: string): Promise<financeResponse> => {
    return http.put(/ finance/\/status, { status })
}

/**
 * 导出 finance 数据
 */
export const exportfinance = (params?: financeListParams): Promise<Blob> => {
    return http.get('/finance/export', { params, responseType: 'blob' })
}

/**
 * 获取 finance 统计信息
 */
export const getfinanceStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/finance/stats')
}
