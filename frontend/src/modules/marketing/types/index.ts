// marketing 类型定义
export interface MarketingData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface MarketingListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface MarketingListResponse {
    data: MarketingData[]
    total: number
    page: number
    pageSize: number
}

export interface MarketingResponse {
    data: MarketingData
    message: string
    success: boolean
}
