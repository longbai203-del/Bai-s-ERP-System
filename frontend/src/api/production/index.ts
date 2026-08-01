// Production API 服务
import http from '@/api/http'

export const getProductionList = (params?: any) => {
    return http.get('/Production', { params })
}

export const getProductionDetail = (id: number) => {
    return http.get('/Production/' + id)
}

export const createProduction = (data: any) => {
    return http.post('/Production', data)
}

export const updateProduction = (id: number, data: any) => {
    return http.put('/Production/' + id, data)
}

export const deleteProduction = (id: number) => {
    return http.delete('/Production/' + id)
}

export const ProductionApi = {
    getList: getProductionList,
    getDetail: getProductionDetail,
    create: createProduction,
    update: updateProduction,
    delete: deleteProduction,
}
