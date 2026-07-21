// dashboard 模块 API 服务
import http from '../http'

export interface dashboardData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface dashboardListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface dashboardListResponse {
    data: dashboardData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getdashboardList = (params?: dashboardListParams) => {
    return http.get('/dashboard', { params })
}

// 获取详情
export const getdashboardDetail = (id: number) => {
    return http.get(/ dashboard/\)
}

// 创建
export const createdashboard = (data: any) => {
    return http.post('/dashboard', data)
}

// 更新
export const updatedashboard = (id: number, data: any) => {
    return http.put(/ dashboard/\, data)
}

// 删除
export const deletedashboard = (id: number) => {
    return http.delete(/ dashboard/\)
}
