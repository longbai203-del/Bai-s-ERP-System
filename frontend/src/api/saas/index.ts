// saas 模块 API 服务
import http from '../http'

export interface saasData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface saasListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface saasListResponse {
    data: saasData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getsaasList = (params?: saasListParams) => {
    return http.get('/saas', { params })
}

// 获取详情
export const getsaasDetail = (id: number) => {
    return http.get(/ saas/\)
}

// 创建
export const createsaas = (data: any) => {
    return http.post('/saas', data)
}

// 更新
export const updatesaas = (id: number, data: any) => {
    return http.put(/ saas/\, data)
}

// 删除
export const deletesaas = (id: number) => {
    return http.delete(/ saas/\)
}
