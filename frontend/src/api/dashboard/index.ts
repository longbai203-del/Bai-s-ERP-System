// Dashboard API 服务
import http from '@/api/http'

export const getDashboardList = (params?: any) => {
    return http.get('/Dashboard', { params })
}

export const getDashboardDetail = (id: number) => {
    return http.get('/Dashboard/' + id)
}

export const createDashboard = (data: any) => {
    return http.post('/Dashboard', data)
}

export const updateDashboard = (id: number, data: any) => {
    return http.put('/Dashboard/' + id, data)
}

export const deleteDashboard = (id: number) => {
    return http.delete('/Dashboard/' + id)
}

export const DashboardApi = {
    getList: getDashboardList,
    getDetail: getDashboardDetail,
    create: createDashboard,
    update: updateDashboard,
    delete: deleteDashboard,
}
