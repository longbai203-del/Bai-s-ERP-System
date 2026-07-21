// purchase 模块 API 服务
import http from '../http'

export interface purchaseData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface purchaseListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface purchaseListResponse {
    data: purchaseData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getpurchaseList = (params?: purchaseListParams) => {
    return http.get('/purchase', { params })
}

// 获取详情
export const getpurchaseDetail = (id: number) => {
    return http.get(/ purchase/\)
}

// 创建
export const createpurchase = (data: any) => {
    return http.post('/purchase', data)
}

// 更新
export const updatepurchase = (id: number, data: any) => {
    return http.put(/ purchase/\, data)
}

// 删除
export const deletepurchase = (id: number) => {
    return http.delete(/ purchase/\)
}
