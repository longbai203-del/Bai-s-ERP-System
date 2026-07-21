// approval 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface approvalData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface approvalListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface approvalListResponse {
    data: approvalData[]
    total: number
    page: number
    pageSize: number
}

export interface approvalResponse {
    data: approvalData
    message: string
    success: boolean
}

export interface approvalCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface approvalUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 approval 列表
 */
export const getapprovalList = (params?: approvalListParams): Promise<approvalListResponse> => {
    return http.get('/approval', { params })
}

/**
 * 获取 approval 详情
 */
export const getapprovalDetail = (id: number): Promise<approvalResponse> => {
    return http.get(/ approval/\)
}

/**
 * 创建 approval
 */
export const createapproval = (data: approvalCreateParams): Promise<approvalResponse> => {
    return http.post('/approval', data)
}

/**
 * 更新 approval
 */
export const updateapproval = (id: number, data: approvalUpdateParams): Promise<approvalResponse> => {
    return http.put(/ approval/\, data)
}

/**
 * 删除 approval
 */
export const deleteapproval = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ approval/\)
}

/**
 * 批量删除 approval
 */
export const batchDeleteapproval = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/approval/batch-delete', { ids })
}

/**
 * 更新 approval 状态
 */
export const updateapprovalStatus = (id: number, status: string): Promise<approvalResponse> => {
    return http.put(/ approval/\/status, { status })
}

/**
 * 导出 approval 数据
 */
export const exportapproval = (params?: approvalListParams): Promise<Blob> => {
    return http.get('/approval/export', { params, responseType: 'blob' })
}

/**
 * 获取 approval 统计信息
 */
export const getapprovalStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/approval/stats')
}
