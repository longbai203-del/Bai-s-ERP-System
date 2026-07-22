// products API 服务
import http from '@/api/http'

export interface ProductsData {
    id: number
    name: string
    // 根据业务扩展
}

export const getProductsList = (params?: any) => {
    return http.get('/products', { params })
}

export const getProductsDetail = (id: number) => {
    return http.get(/products/\)
}

export const createProducts = (data: any) => {
    return http.post('/products', data)
}

export const updateProducts = (id: number, data: any) => {
    return http.put(/products/\, data)
}

export const deleteProducts = (id: number) => {
    return http.delete(/products/\)
}
