// ai 模块 API 服务
import http from '../http'

export interface aiData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface aiListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface aiListResponse {
    data: aiData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getaiList = (params?: aiListParams) => {
    return http.get('/ai', { params })
}

// 获取详情
export const getaiDetail = (id: number) => {
    return http.get(/ ai/\)
}

// 创建
export const createai = (data: any) => {
    return http.post('/ai', data)
}

// 更新
export const updateai = (id: number, data: any) => {
    return http.put(/ ai/\, data)
}

// 删除
export const deleteai = (id: number) => {
    return http.delete(/ ai/\)
}
