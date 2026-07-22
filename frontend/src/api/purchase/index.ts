// purchase API 服务
import http from '@/api/http'

export interface PurchaseData {
    id: number
    name: string
    // 根据业务扩展
}

export const getPurchaseList = (params?: any) => {
    return http.get('/purchase', { params })
}

export const getPurchaseDetail = (id: number) => {
    return http.get(/purchase/\)
}

export const createPurchase = (data: any) => {
    return http.post('/purchase', data)
}

export const updatePurchase = (id: number, data: any) => {
    return http.put(/purchase/\, data)
}

export const deletePurchase = (id: number) => {
    return http.delete(/purchase/\)
}
