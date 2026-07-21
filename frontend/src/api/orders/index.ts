// orders 模块 API 服务
import http from '../http'

export interface ordersData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface ordersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ordersListResponse {
    data: ordersData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getordersList = (params?: ordersListParams) => {
    return http.get('/orders', { params })
}

// 获取详情
export const getordersDetail = (id: number) => {
    return http.get(/ orders/\)
}

// 创建
export const createorders = (data: any) => {
    return http.post('/orders', data)
}

// 更新
export const updateorders = (id: number, data: any) => {
    return http.put(/ orders/\, data)
}

// 删除
export const deleteorders = (id: number) => {
    return http.delete(/ orders/\)
}
