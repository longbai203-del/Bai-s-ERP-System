// saas 类型定义
export interface SaasData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface SaasListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface SaasListResponse {
    data: SaasData[]
    total: number
    page: number
    pageSize: number
}

export interface SaasResponse {
    data: SaasData
    message: string
    success: boolean
}
