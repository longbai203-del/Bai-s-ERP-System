// Products API 服务
import http from '@/api/http'

export const getProductsList = (params?: any) => {
    return http.get('/Products', { params })
}

export const getProductsDetail = (id: number) => {
    return http.get('/Products/' + id)
}

export const createProducts = (data: any) => {
    return http.post('/Products', data)
}

export const updateProducts = (id: number, data: any) => {
    return http.put('/Products/' + id, data)
}

export const deleteProducts = (id: number) => {
    return http.delete('/Products/' + id)
}

export const ProductsApi = {
    getList: getProductsList,
    getDetail: getProductsDetail,
    create: createProducts,
    update: updateProducts,
    delete: deleteProducts,
}
