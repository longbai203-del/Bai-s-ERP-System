// orders 类型定义
export interface OrdersData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface OrdersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface OrdersListResponse {
    data: OrdersData[]
    total: number
    page: number
    pageSize: number
}

export interface OrdersResponse {
    data: OrdersData
    message: string
    success: boolean
}
