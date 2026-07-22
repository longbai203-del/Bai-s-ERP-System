// production 类型定义
export interface ProductionData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface ProductionListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ProductionListResponse {
    data: ProductionData[]
    total: number
    page: number
    pageSize: number
}

export interface ProductionResponse {
    data: ProductionData
    message: string
    success: boolean
}
