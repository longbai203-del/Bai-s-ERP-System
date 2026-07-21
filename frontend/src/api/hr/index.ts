// hr 模块 API 服务
import http from '../http'

export interface hrData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface hrListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface hrListResponse {
    data: hrData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const gethrList = (params?: hrListParams) => {
    return http.get('/hr', { params })
}

// 获取详情
export const gethrDetail = (id: number) => {
    return http.get(/ hr/\)
}

// 创建
export const createhr = (data: any) => {
    return http.post('/hr', data)
}

// 更新
export const updatehr = (id: number, data: any) => {
    return http.put(/ hr/\, data)
}

// 删除
export const deletehr = (id: number) => {
    return http.delete(/ hr/\)
}
