// saas 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface saasData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface saasListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface saasListResponse {
    data: saasData[]
    total: number
    page: number
    pageSize: number
}

export interface saasResponse {
    data: saasData
    message: string
    success: boolean
}

export interface saasCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface saasUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 saas 列表
 */
export const getsaasList = (params?: saasListParams): Promise<saasListResponse> => {
    return http.get('/saas', { params })
}

/**
 * 获取 saas 详情
 */
export const getsaasDetail = (id: number): Promise<saasResponse> => {
    return http.get(/ saas/\)
}

/**
 * 创建 saas
 */
export const createsaas = (data: saasCreateParams): Promise<saasResponse> => {
    return http.post('/saas', data)
}

/**
 * 更新 saas
 */
export const updatesaas = (id: number, data: saasUpdateParams): Promise<saasResponse> => {
    return http.put(/ saas/\, data)
}

/**
 * 删除 saas
 */
export const deletesaas = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ saas/\)
}

/**
 * 批量删除 saas
 */
export const batchDeletesaas = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/saas/batch-delete', { ids })
}

/**
 * 更新 saas 状态
 */
export const updatesaasStatus = (id: number, status: string): Promise<saasResponse> => {
    return http.put(/ saas/\/status, { status })
}

/**
 * 导出 saas 数据
 */
export const exportsaas = (params?: saasListParams): Promise<Blob> => {
    return http.get('/saas/export', { params, responseType: 'blob' })
}

/**
 * 获取 saas 统计信息
 */
export const getsaasStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/saas/stats')
}
