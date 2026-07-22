// orders API 服务
import http from '@/api/http'

export interface OrdersData {
    id: number
    name: string
    // 根据业务扩展
}

export const getOrdersList = (params?: any) => {
    return http.get('/orders', { params })
}

export const getOrdersDetail = (id: number) => {
    return http.get(/orders/\)
}

export const createOrders = (data: any) => {
    return http.post('/orders', data)
}

export const updateOrders = (id: number, data: any) => {
    return http.put(/orders/\, data)
}

export const deleteOrders = (id: number) => {
    return http.delete(/orders/\)
}
