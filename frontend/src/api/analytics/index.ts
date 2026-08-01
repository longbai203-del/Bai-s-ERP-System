// Analytics API 服务
import http from '@/api/http'

export const getAnalyticsList = (params?: any) => {
    return http.get('/Analytics', { params })
}

export const getAnalyticsDetail = (id: number) => {
    return http.get('/Analytics/' + id)
}

export const createAnalytics = (data: any) => {
    return http.post('/Analytics', data)
}

export const updateAnalytics = (id: number, data: any) => {
    return http.put('/Analytics/' + id, data)
}

export const deleteAnalytics = (id: number) => {
    return http.delete('/Analytics/' + id)
}

export const AnalyticsApi = {
    getList: getAnalyticsList,
    getDetail: getAnalyticsDetail,
    create: createAnalytics,
    update: updateAnalytics,
    delete: deleteAnalytics,
}
