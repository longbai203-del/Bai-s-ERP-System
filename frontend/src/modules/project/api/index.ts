// project 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface projectData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface projectListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface projectListResponse {
    data: projectData[]
    total: number
    page: number
    pageSize: number
}

export interface projectResponse {
    data: projectData
    message: string
    success: boolean
}

export interface projectCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface projectUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 project 列表
 */
export const getprojectList = (params?: projectListParams): Promise<projectListResponse> => {
    return http.get('/project', { params })
}

/**
 * 获取 project 详情
 */
export const getprojectDetail = (id: number): Promise<projectResponse> => {
    return http.get(/ project/\)
}

/**
 * 创建 project
 */
export const createproject = (data: projectCreateParams): Promise<projectResponse> => {
    return http.post('/project', data)
}

/**
 * 更新 project
 */
export const updateproject = (id: number, data: projectUpdateParams): Promise<projectResponse> => {
    return http.put(/ project/\, data)
}

/**
 * 删除 project
 */
export const deleteproject = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ project/\)
}

/**
 * 批量删除 project
 */
export const batchDeleteproject = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/project/batch-delete', { ids })
}

/**
 * 更新 project 状态
 */
export const updateprojectStatus = (id: number, status: string): Promise<projectResponse> => {
    return http.put(/ project/\/status, { status })
}

/**
 * 导出 project 数据
 */
export const exportproject = (params?: projectListParams): Promise<Blob> => {
    return http.get('/project/export', { params, responseType: 'blob' })
}

/**
 * 获取 project 统计信息
 */
export const getprojectStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/project/stats')
}
