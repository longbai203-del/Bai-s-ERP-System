// production 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface productionData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface productionListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface productionListResponse {
    data: productionData[]
    total: number
    page: number
    pageSize: number
}

export interface productionResponse {
    data: productionData
    message: string
    success: boolean
}

export interface productionCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface productionUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 production 列表
 */
export const getproductionList = (params?: productionListParams): Promise<productionListResponse> => {
    return http.get('/production', { params })
}

/**
 * 获取 production 详情
 */
export const getproductionDetail = (id: number): Promise<productionResponse> => {
    return http.get(/ production/\)
}

/**
 * 创建 production
 */
export const createproduction = (data: productionCreateParams): Promise<productionResponse> => {
    return http.post('/production', data)
}

/**
 * 更新 production
 */
export const updateproduction = (id: number, data: productionUpdateParams): Promise<productionResponse> => {
    return http.put(/ production/\, data)
}

/**
 * 删除 production
 */
export const deleteproduction = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ production/\)
}

/**
 * 批量删除 production
 */
export const batchDeleteproduction = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/production/batch-delete', { ids })
}

/**
 * 更新 production 状态
 */
export const updateproductionStatus = (id: number, status: string): Promise<productionResponse> => {
    return http.put(/ production/\/status, { status })
}

/**
 * 导出 production 数据
 */
export const exportproduction = (params?: productionListParams): Promise<Blob> => {
    return http.get('/production/export', { params, responseType: 'blob' })
}

/**
 * 获取 production 统计信息
 */
export const getproductionStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/production/stats')
}
