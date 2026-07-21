// system 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface systemData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface systemListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface systemListResponse {
    data: systemData[]
    total: number
    page: number
    pageSize: number
}

export interface systemResponse {
    data: systemData
    message: string
    success: boolean
}

export interface systemCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface systemUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 system 列表
 */
export const getsystemList = (params?: systemListParams): Promise<systemListResponse> => {
    return http.get('/system', { params })
}

/**
 * 获取 system 详情
 */
export const getsystemDetail = (id: number): Promise<systemResponse> => {
    return http.get(/ system/\)
}

/**
 * 创建 system
 */
export const createsystem = (data: systemCreateParams): Promise<systemResponse> => {
    return http.post('/system', data)
}

/**
 * 更新 system
 */
export const updatesystem = (id: number, data: systemUpdateParams): Promise<systemResponse> => {
    return http.put(/ system/\, data)
}

/**
 * 删除 system
 */
export const deletesystem = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ system/\)
}

/**
 * 批量删除 system
 */
export const batchDeletesystem = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/system/batch-delete', { ids })
}

/**
 * 更新 system 状态
 */
export const updatesystemStatus = (id: number, status: string): Promise<systemResponse> => {
    return http.put(/ system/\/status, { status })
}

/**
 * 导出 system 数据
 */
export const exportsystem = (params?: systemListParams): Promise<Blob> => {
    return http.get('/system/export', { params, responseType: 'blob' })
}

/**
 * 获取 system 统计信息
 */
export const getsystemStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/system/stats')
}
