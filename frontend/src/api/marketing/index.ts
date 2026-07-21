// marketing 模块 API 服务
import http from '../http'

export interface marketingData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface marketingListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface marketingListResponse {
    data: marketingData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getmarketingList = (params?: marketingListParams) => {
    return http.get('/marketing', { params })
}

// 获取详情
export const getmarketingDetail = (id: number) => {
    return http.get(/ marketing/\)
}

// 创建
export const createmarketing = (data: any) => {
    return http.post('/marketing', data)
}

// 更新
export const updatemarketing = (id: number, data: any) => {
    return http.put(/ marketing/\, data)
}

// 删除
export const deletemarketing = (id: number) => {
    return http.delete(/ marketing/\)
}
