// settings 模块 API 服务
import http from '@/api/http'

// ==================== 类型定义 ====================
export interface settingsData {
    id: number
    name: string
    code?: string
    status?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    // 根据业务需要添加更多字段
}

export interface settingsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startDate?: string
    endDate?: string
    // 根据业务需要添加更多查询参数
}

export interface settingsListResponse {
    data: settingsData[]
    total: number
    page: number
    pageSize: number
}

export interface settingsResponse {
    data: settingsData
    message: string
    success: boolean
}

export interface settingsCreateParams {
    name: string
    code?: string
    description?: string
    // 根据业务需要添加更多创建参数
}

export interface settingsUpdateParams {
    id: number
    name?: string
    code?: string
    status?: string
    description?: string
    // 根据业务需要添加更多更新参数
}

// ==================== API 函数 ====================

/**
 * 获取 settings 列表
 */
export const getsettingsList = (params?: settingsListParams): Promise<settingsListResponse> => {
    return http.get('/settings', { params })
}

/**
 * 获取 settings 详情
 */
export const getsettingsDetail = (id: number): Promise<settingsResponse> => {
    return http.get(/ settings/\)
}

/**
 * 创建 settings
 */
export const createsettings = (data: settingsCreateParams): Promise<settingsResponse> => {
    return http.post('/settings', data)
}

/**
 * 更新 settings
 */
export const updatesettings = (id: number, data: settingsUpdateParams): Promise<settingsResponse> => {
    return http.put(/ settings/\, data)
}

/**
 * 删除 settings
 */
export const deletesettings = (id: number): Promise<{ success: boolean; message: string }> => {
    return http.delete(/ settings/\)
}

/**
 * 批量删除 settings
 */
export const batchDeletesettings = (ids: number[]): Promise<{ success: boolean; message: string }> => {
    return http.post('/settings/batch-delete', { ids })
}

/**
 * 更新 settings 状态
 */
export const updatesettingsStatus = (id: number, status: string): Promise<settingsResponse> => {
    return http.put(/ settings/\/status, { status })
}

/**
 * 导出 settings 数据
 */
export const exportsettings = (params?: settingsListParams): Promise<Blob> => {
    return http.get('/settings/export', { params, responseType: 'blob' })
}

/**
 * 获取 settings 统计信息
 */
export const getsettingsStats = (): Promise<{
    total: number
    active: number
    inactive: number
}> => {
    return http.get('/settings/stats')
}
