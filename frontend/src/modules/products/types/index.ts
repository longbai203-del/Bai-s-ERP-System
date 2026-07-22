// products 类型定义
export interface ProductsData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface ProductsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ProductsListResponse {
    data: ProductsData[]
    total: number
    page: number
    pageSize: number
}

export interface ProductsResponse {
    data: ProductsData
    message: string
    success: boolean
}
