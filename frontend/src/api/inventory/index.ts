// inventory 模块 API 服务
import http from '../http'

export interface inventoryData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface inventoryListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface inventoryListResponse {
    data: inventoryData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getinventoryList = (params?: inventoryListParams) => {
    return http.get('/inventory', { params })
}

// 获取详情
export const getinventoryDetail = (id: number) => {
    return http.get(/ inventory/\)
}

// 创建
export const createinventory = (data: any) => {
    return http.post('/inventory', data)
}

// 更新
export const updateinventory = (id: number, data: any) => {
    return http.put(/ inventory/\, data)
}

// 删除
export const deleteinventory = (id: number) => {
    return http.delete(/ inventory/\)
}
