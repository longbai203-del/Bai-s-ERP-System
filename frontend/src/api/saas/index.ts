// saas API 服务
import http from '@/api/http'

export interface SaasData {
    id: number
    name: string
    // 根据业务扩展
}

export const getSaasList = (params?: any) => {
    return http.get('/saas', { params })
}

export const getSaasDetail = (id: number) => {
    return http.get(`/saas/${id}`)
}

export const createSaas = (data: any) => {
    return http.post('/saas', data)
}

export const updateSaas = (id: number, data: any) => {
    return http.put(`/saas/${id}`, data)
}

export const deleteSaas = (id: number) => {
    return http.delete(`/saas/${id}`)
}

export const saasApi = {
    getList: getSaasList,
    getDetail: getSaasDetail,
    create: createSaas,
    update: updateSaas,
    delete: deleteSaas,
}
