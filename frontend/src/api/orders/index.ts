// Orders API 服务
import http from '@/api/http'

export const getOrdersList = (params?: any) => {
    return http.get('/Orders', { params })
}

export const getOrdersDetail = (id: number) => {
    return http.get('/Orders/' + id)
}

export const createOrders = (data: any) => {
    return http.post('/Orders', data)
}

export const updateOrders = (id: number, data: any) => {
    return http.put('/Orders/' + id, data)
}

export const deleteOrders = (id: number) => {
    return http.delete('/Orders/' + id)
}

export const OrdersApi = {
    getList: getOrdersList,
    getDetail: getOrdersDetail,
    create: createOrders,
    update: updateOrders,
    delete: deleteOrders,
}
