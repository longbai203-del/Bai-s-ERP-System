// purchase 类型定义
export interface PurchaseData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface PurchaseListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface PurchaseListResponse {
    data: PurchaseData[]
    total: number
    page: number
    pageSize: number
}

export interface PurchaseResponse {
    data: PurchaseData
    message: string
    success: boolean
}
