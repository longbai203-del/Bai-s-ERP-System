// orders API 服务
import http from '@/api/http'

export interface OrdersData {
    id: number
    name: string
}

export const getOrdersList = (params?: any) => {
    return http.get('/orders', { params })
}

export const getOrdersDetail = (id: number) => {
    return http.get('/orders/' + id)
}

export const createOrder = (data: any) => {
    return http.post('/orders', data)
}

export const updateOrder = (id: number, data: any) => {
    return http.put('/orders/' + id, data)
}

export const deleteOrder = (id: number) => {
    return http.delete('/orders/' + id)
}

// 导出 orderApi
export const orderApi = {
    getOrders: getOrdersList,
    getOrderById: getOrdersDetail,
    createOrder: createOrder,
    updateOrder: updateOrder,
    updateOrderStatus: (id: number, status: string) => {
        return http.patch('/orders/' + id + '/status', { status })
    },
    deleteOrder: deleteOrder,
}

export default {
    getOrdersList,
    getOrdersDetail,
    createOrder,
    updateOrder,
    deleteOrder,
    orderApi,
}
