// customers 类型定义
export interface CustomersData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface CustomersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface CustomersListResponse {
    data: CustomersData[]
    total: number
    page: number
    pageSize: number
}

export interface CustomersResponse {
    data: CustomersData
    message: string
    success: boolean
}
