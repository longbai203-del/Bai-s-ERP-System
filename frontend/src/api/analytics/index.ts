// analytics API 服务
import http from '@/api/http'

export interface AnalyticsData {
    id: number
    name: string
    // 根据业务扩展
}

export const getAnalyticsList = (params?: any) => {
    return http.get('/analytics', { params })
}

export const getAnalyticsDetail = (id: number) => {
    return http.get(`/analytics/${id}`)
}

export const createAnalytics = (data: any) => {
    return http.post('/analytics', data)
}

export const updateAnalytics = (id: number, data: any) => {
    return http.put(`/analytics/${id}`, data)
}

export const deleteAnalytics = (id: number) => {
    return http.delete(`/analytics/${id}`)
}

export const analyticsApi = {
    getList: getAnalyticsList,
    getDetail: getAnalyticsDetail,
    create: createAnalytics,
    update: updateAnalytics,
    delete: deleteAnalytics,
}
