// inventory 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface inventoryData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface inventoryListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface inventoryListResponse {
    data: inventoryData[]
    total: number
    page: number
    pageSize: number
}

export interface inventoryResponse {
    data: inventoryData
    message: string
    success: boolean
}

export interface inventoryCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface inventoryUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 inventory 列表
 */
export const getinventoryList = (params?: inventoryListParams): Promise<inventoryListResponse> => {
    return http.get('/inventory', { params })
}

/**
 * 获取 inventory 详情
 */
export const getinventoryDetail = (id: number): Promise<inventoryResponse> => {
    return http.get(/ inventory/\)
}

/**
 * 创建 inventory
 */
export const createinventory = (data: inventoryCreateParams): Promise<inventoryResponse> => {
    return http.post('/inventory', data)
}

/**
 * 更新 inventory
 */
export const updateinventory = (id: number, data: inventoryUpdateParams): Promise<inventoryResponse> => {
    return http.put(/ inventory/\, data)
}

/**
 * 删除 inventory
 */
export const deleteinventory = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ inventory/\)
}

/**
 * 批量删除 inventory
 */
export const batchDeleteinventory = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/inventory/batch-delete', { ids })
}

/**
 * 更新 inventory 状态
 */
export const updateinventoryStatus = (id: number, status: string): Promise<inventoryResponse> => {
    return http.put(/ inventory/\/status, { status })
}

/**
 * 导出 inventory 数据
 */
export const exportinventory = (params?: inventoryListParams): Promise<Blob> => {
    return http.get('/inventory/export', { params, responseType: 'blob' })
}

/**
 * 获取 inventory 统计信息
 */
export const getinventoryStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/inventory/stats')
}
