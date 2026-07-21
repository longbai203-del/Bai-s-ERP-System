// products 模块 API 服务
import http from '../http'

export interface productsData {
    id: number
    name: string
    // 根据业务需求添加更多字段
}

export interface productsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface productsListResponse {
    data: productsData[]
    total: number
    page: number
    pageSize: number
}

// 获取列表
export const getproductsList = (params?: productsListParams) => {
    return http.get('/products', { params })
}

// 获取详情
export const getproductsDetail = (id: number) => {
    return http.get(/ products/\)
}

// 创建
export const createproducts = (data: any) => {
    return http.post('/products', data)
}

// 更新
export const updateproducts = (id: number, data: any) => {
    return http.put(/ products/\, data)
}

// 删除
export const deleteproducts = (id: number) => {
    return http.delete(/ products/\)
}
