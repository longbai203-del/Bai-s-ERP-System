// pos 模块 API 服务
import http from '../http'

export interface posData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface posListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface posListResponse {
    data: posData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getposList = (params?: posListParams) => {
    return http.get('/pos', { params })
}

// 获取详情
export const getposDetail = (id: number) => {
    return http.get(/ pos/\)
}

// 创建
export const createpos = (data: any) => {
    return http.post('/pos', data)
}

// 更新
export const updatepos = (id: number, data: any) => {
    return http.put(/ pos/\, data)
}

// 删除
export const deletepos = (id: number) => {
    return http.delete(/ pos/\)
}
