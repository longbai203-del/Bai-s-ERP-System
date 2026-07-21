// finance 模块 API 服务
import http from '../http'

export interface financeData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface financeListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface financeListResponse {
    data: financeData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getfinanceList = (params?: financeListParams) => {
    return http.get('/finance', { params })
}

// 获取详情
export const getfinanceDetail = (id: number) => {
    return http.get(/ finance/\)
}

// 创建
export const createfinance = (data: any) => {
    return http.post('/finance', data)
}

// 更新
export const updatefinance = (id: number, data: any) => {
    return http.put(/ finance/\, data)
}

// 删除
export const deletefinance = (id: number) => {
    return http.delete(/ finance/\)
}
