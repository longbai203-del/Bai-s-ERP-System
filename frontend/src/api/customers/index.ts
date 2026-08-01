// Customers API 服务
import http from '@/api/http'

export const getCustomersList = (params?: any) => {
    return http.get('/Customers', { params })
}

export const getCustomersDetail = (id: number) => {
    return http.get('/Customers/' + id)
}

export const createCustomers = (data: any) => {
    return http.post('/Customers', data)
}

export const updateCustomers = (id: number, data: any) => {
    return http.put('/Customers/' + id, data)
}

export const deleteCustomers = (id: number) => {
    return http.delete('/Customers/' + id)
}

export const CustomersApi = {
    getList: getCustomersList,
    getDetail: getCustomersDetail,
    create: createCustomers,
    update: updateCustomers,
    delete: deleteCustomers,
}
