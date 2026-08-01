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
    return http.get(`/reports/${id}`)
}

export const getReportList = getReportsList
export const getReportDetail = getReportsDetail

export const createReport = (data: any) => {
    return http.post('/reports', data)
}

export const updateReport = (id: number, data: any) => {
    return http.put(`/reports/${id}`, data)
}

export const deleteReport = (id: number) => {
    return http.delete(`/reports/${id}`)
}

export const reportsApi = {
    getList: getReportList,
    getDetail: getReportDetail,
    create: createReport,
    update: updateReport,
    delete: deleteReport,
}
