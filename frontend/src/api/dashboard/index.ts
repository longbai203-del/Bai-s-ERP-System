// dashboard API 服务
import http from '@/api/http'

export interface DashboardData {
    id: number
    name: string
    // 根据业务扩展
}

export const getDashboardList = (params?: any) => {
    return http.get('/dashboard', { params })
}

export const getDashboardDetail = (id: number) => {
    return http.get(`/dashboard/${id}`)
}

export const createDashboard = (data: any) => {
    return http.post('/dashboard', data)
}

export const updateDashboard = (id: number, data: any) => {
    return http.put(`/dashboard/${id}`, data)
}

export const deleteDashboard = (id: number) => {
    return http.delete(`/dashboard/${id}`)
}

export const dashboardApi = {
    getList: getDashboardList,
    getDetail: getDashboardDetail,
    create: createDashboard,
    update: updateDashboard,
    delete: deleteDashboard,
    getDashboardData: () => http.get('/dashboard'),
}
