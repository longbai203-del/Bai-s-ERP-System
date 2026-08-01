// Reports API 服务
import http from '@/api/http'

export const getReportsList = (params?: any) => {
    return http.get('/Reports', { params })
}

export const getReportsDetail = (id: number) => {
    return http.get('/Reports/' + id)
}

export const createReports = (data: any) => {
    return http.post('/Reports', data)
}

export const updateReports = (id: number, data: any) => {
    return http.put('/Reports/' + id, data)
}

export const deleteReports = (id: number) => {
    return http.delete('/Reports/' + id)
}

export const ReportsApi = {
    getList: getReportsList,
    getDetail: getReportsDetail,
    create: createReports,
    update: updateReports,
    delete: deleteReports,
}
