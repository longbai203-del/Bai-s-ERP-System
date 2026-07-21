// products 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface productsData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface productsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface productsListResponse {
    data: productsData[]
    total: number
    page: number
    pageSize: number
}

export interface productsResponse {
    data: productsData
    message: string
    success: boolean
}

export interface productsCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface productsUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 products 列表
 */
export const getproductsList = (params?: productsListParams): Promise<productsListResponse> => {
    return http.get('/products', { params })
}

/**
 * 获取 products 详情
 */
export const getproductsDetail = (id: number): Promise<productsResponse> => {
    return http.get(/ products/\)
}

/**
 * 创建 products
 */
export const createproducts = (data: productsCreateParams): Promise<productsResponse> => {
    return http.post('/products', data)
}

/**
 * 更新 products
 */
export const updateproducts = (id: number, data: productsUpdateParams): Promise<productsResponse> => {
    return http.put(/ products/\, data)
}

/**
 * 删除 products
 */
export const deleteproducts = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ products/\)
}

/**
 * 批量删除 products
 */
export const batchDeleteproducts = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/products/batch-delete', { ids })
}

/**
 * 更新 products 状态
 */
export const updateproductsStatus = (id: number, status: string): Promise<productsResponse> => {
    return http.put(/ products/\/status, { status })
}

/**
 * 导出 products 数据
 */
export const exportproducts = (params?: productsListParams): Promise<Blob> => {
    return http.get('/products/export', { params, responseType: 'blob' })
}

/**
 * 获取 products 统计信息
 */
export const getproductsStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/products/stats')
}
