// reports API 服务
import http from '@/api/http'

export interface ReportsData {
    id: number
    name: string
    // 根据业务扩展
}

export const getReportsList = (params?: any) => {
    return http.get('/reports', { params })
}

export const getReportsDetail = (id: number) => {
    return http.get(/reports/\)
}

export const createReports = (data: any) => {
    return http.post('/reports', data)
}

export const updateReports = (id: number, data: any) => {
    return http.put(/reports/\, data)
}

export const deleteReports = (id: number) => {
    return http.delete(/reports/\)
}
