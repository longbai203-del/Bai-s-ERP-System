// Purchase API 服务
import http from '@/api/http'

export const getPurchaseList = (params?: any) => {
    return http.get('/Purchase', { params })
}

export const getPurchaseDetail = (id: number) => {
    return http.get('/Purchase/' + id)
}

export const createPurchase = (data: any) => {
    return http.post('/Purchase', data)
}

export const updatePurchase = (id: number, data: any) => {
    return http.put('/Purchase/' + id, data)
}

export const deletePurchase = (id: number) => {
    return http.delete('/Purchase/' + id)
}

export const PurchaseApi = {
    getList: getPurchaseList,
    getDetail: getPurchaseDetail,
    create: createPurchase,
    update: updatePurchase,
    delete: deletePurchase,
}
