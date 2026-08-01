// Saas API 服务
import http from '@/api/http'

export const getSaasList = (params?: any) => {
    return http.get('/Saas', { params })
}

export const getSaasDetail = (id: number) => {
    return http.get('/Saas/' + id)
}

export const createSaas = (data: any) => {
    return http.post('/Saas', data)
}

export const updateSaas = (id: number, data: any) => {
    return http.put('/Saas/' + id, data)
}

export const deleteSaas = (id: number) => {
    return http.delete('/Saas/' + id)
}

export const SaasApi = {
    getList: getSaasList,
    getDetail: getSaasDetail,
    create: createSaas,
    update: updateSaas,
    delete: deleteSaas,
}
