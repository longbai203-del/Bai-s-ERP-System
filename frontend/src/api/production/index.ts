// production API 服务
import http from '@/api/http'

export const getproductionList = (params?: any) => {
    return http.get('/production', { params })
}

export const getproductionDetail = (id: number) => {
    return http.get(`/production/${id}`)
}

export const getProductionList = getproductionList
export const getProductionDetail = getproductionDetail

export const createProduction = (data: any) => {
    return http.post('/production', data)
}

export const updateProduction = (id: number, data: any) => {
    return http.put(`/production/${id}`, data)
}

export const deleteProduction = (id: number) => {
    return http.delete(`/production/${id}`)
}

export const productionApi = {
    getList: getProductionList,
    getDetail: getProductionDetail,
    create: createProduction,
    update: updateProduction,
    delete: deleteProduction,
}
