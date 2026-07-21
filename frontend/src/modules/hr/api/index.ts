// hr 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface hrData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface hrListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface hrListResponse {
    data: hrData[]
    total: number
    page: number
    pageSize: number
}

export interface hrResponse {
    data: hrData
    message: string
    success: boolean
}

export interface hrCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface hrUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 hr 列表
 */
export const gethrList = (params?: hrListParams): Promise<hrListResponse> => {
    return http.get('/hr', { params })
}

/**
 * 获取 hr 详情
 */
export const gethrDetail = (id: number): Promise<hrResponse> => {
    return http.get(/ hr/\)
}

/**
 * 创建 hr
 */
export const createhr = (data: hrCreateParams): Promise<hrResponse> => {
    return http.post('/hr', data)
}

/**
 * 更新 hr
 */
export const updatehr = (id: number, data: hrUpdateParams): Promise<hrResponse> => {
    return http.put(/ hr/\, data)
}

/**
 * 删除 hr
 */
export const deletehr = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ hr/\)
}

/**
 * 批量删除 hr
 */
export const batchDeletehr = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/hr/batch-delete', { ids })
}

/**
 * 更新 hr 状态
 */
export const updatehrStatus = (id: number, status: string): Promise<hrResponse> => {
    return http.put(/ hr/\/status, { status })
}

/**
 * 导出 hr 数据
 */
export const exporthr = (params?: hrListParams): Promise<Blob> => {
    return http.get('/hr/export', { params, responseType: 'blob' })
}

/**
 * 获取 hr 统计信息
 */
export const gethrStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/hr/stats')
}
