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
    return http.get(`/products/${id}`)
}

export const createProduct = (data: any) => {
    return http.post('/products', data)
}

export const updateProduct = (id: number, data: any) => {
    return http.put(`/products/${id}`, data)
}

export const deleteProduct = (id: number) => {
    return http.delete(`/products/${id}`)
}

export const productApi = {
    getList: getProductsList,
    getDetail: getProductsDetail,
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    getProducts: getProductsList,
    getProductDetail: getProductsDetail,
}

export const productsApi = productApi
