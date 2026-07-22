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
    return http.get(/customers/\)
}

export const createCustomers = (data: any) => {
    return http.post('/customers', data)
}

export const updateCustomers = (id: number, data: any) => {
    return http.put(/customers/\, data)
}

export const deleteCustomers = (id: number) => {
    return http.delete(/customers/\)
}
