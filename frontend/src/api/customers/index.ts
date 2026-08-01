// customers API 服务
import http from '@/api/http'

export interface CustomersData {
    id: number
    name: string
    // 根据业务扩展
}

export const getCustomersList = (params?: any) => {
    return http.get('/customers', { params })
}

export const getCustomersDetail = (id: number) => {
    return http.get(`/customers/${id}`)
}

export const getCustomerList = getCustomersList
export const getCustomerDetail = getCustomersDetail

export const createCustomer = (data: any) => {
    return http.post('/customers', data)
}

export const updateCustomer = (id: number, data: any) => {
    return http.put(`/customers/${id}`, data)
}

export const deleteCustomer = (id: number) => {
    return http.delete(`/customers/${id}`)
}

export const customerApi = {
    getList: getCustomerList,
    getDetail: getCustomerDetail,
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
}
