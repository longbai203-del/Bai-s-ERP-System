// reports 模块 API 服务
import http from '../http'

export interface reportsData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface reportsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface reportsListResponse {
    data: reportsData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getreportsList = (params?: reportsListParams) => {
    return http.get('/reports', { params })
}

// 获取详情
export const getreportsDetail = (id: number) => {
    return http.get(/ reports/\)
}

// 创建
export const createreports = (data: any) => {
    return http.post('/reports', data)
}

// 更新
export const updatereports = (id: number, data: any) => {
    return http.put(/ reports/\, data)
}

// 删除
export const deletereports = (id: number) => {
    return http.delete(/ reports/\)
}
