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
    return http.get(`/orders/${id}`)
}

export const createOrder = (data: any) => {
    return http.post('/orders', data)
}

export const updateOrder = (id: number, data: any) => {
    return http.put(`/orders/${id}`, data)
}

export const deleteOrder = (id: number) => {
    return http.delete(`/orders/${id}`)
}

export const orderApi = {
    getList: getOrdersList,
    getDetail: getOrdersDetail,
    create: createOrder,
    update: updateOrder,
    delete: deleteOrder,
    getOrders: getOrdersList,
    getOrderDetail: getOrdersDetail,
    createOrder,
    updateOrder,
    updateOrderStatus: (id: number, data: any) => http.put(`/orders/${id}/status`, data),
    deleteOrder,
}
