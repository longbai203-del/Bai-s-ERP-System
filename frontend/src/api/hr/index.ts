// hr API 服务
import http from '@/api/http'

export interface HrData {
    id: number
    name: string
    // 根据业务扩展
}

export const getHrList = (params?: any) => {
    return http.get('/hr', { params })
}

export const getHrDetail = (id: number) => {
    return http.get(`/hr/${id}`)
}

export const createHr = (data: any) => {
    return http.post('/hr', data)
}

export const updateHr = (id: number, data: any) => {
    return http.put(`/hr/${id}`, data)
}

export const deleteHr = (id: number) => {
    return http.delete(`/hr/${id}`)
}

export const hrApi = {
    getList: getHrList,
    getDetail: getHrDetail,
    create: createHr,
    update: updateHr,
    delete: deleteHr,
    getEmployees: getHrList,
}
