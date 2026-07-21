// customers 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface customersData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface customersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface customersListResponse {
    data: customersData[]
    total: number
    page: number
    pageSize: number
}

export interface customersResponse {
    data: customersData
    message: string
    success: boolean
}

export interface customersCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface customersUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 customers 列表
 */
export const getcustomersList = (params?: customersListParams): Promise<customersListResponse> => {
    return http.get('/customers', { params })
}

/**
 * 获取 customers 详情
 */
export const getcustomersDetail = (id: number): Promise<customersResponse> => {
    return http.get(/ customers/\)
}

/**
 * 创建 customers
 */
export const createcustomers = (data: customersCreateParams): Promise<customersResponse> => {
    return http.post('/customers', data)
}

/**
 * 更新 customers
 */
export const updatecustomers = (id: number, data: customersUpdateParams): Promise<customersResponse> => {
    return http.put(/ customers/\, data)
}

/**
 * 删除 customers
 */
export const deletecustomers = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ customers/\)
}

/**
 * 批量删除 customers
 */
export const batchDeletecustomers = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/customers/batch-delete', { ids })
}

/**
 * 更新 customers 状态
 */
export const updatecustomersStatus = (id: number, status: string): Promise<customersResponse> => {
    return http.put(/ customers/\/status, { status })
}

/**
 * 导出 customers 数据
 */
export const exportcustomers = (params?: customersListParams): Promise<Blob> => {
    return http.get('/customers/export', { params, responseType: 'blob' })
}

/**
 * 获取 customers 统计信息
 */
export const getcustomersStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/customers/stats')
}
