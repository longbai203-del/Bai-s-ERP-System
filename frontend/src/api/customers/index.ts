// customers 模块 API 服务
import http from '../http'

export interface customersData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface customersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface customersListResponse {
    data: customersData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getcustomersList = (params?: customersListParams) => {
    return http.get('/customers', { params })
}

// 获取详情
export const getcustomersDetail = (id: number) => {
    return http.get(/ customers/\)
}

// 创建
export const createcustomers = (data: any) => {
    return http.post('/customers', data)
}

// 更新
export const updatecustomers = (id: number, data: any) => {
    return http.put(/ customers/\, data)
}

// 删除
export const deletecustomers = (id: number) => {
    return http.delete(/ customers/\)
}
