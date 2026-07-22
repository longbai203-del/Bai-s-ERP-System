// reports 类型定义
export interface ReportsData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface ReportsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ReportsListResponse {
    data: ReportsData[]
    total: number
    page: number
    pageSize: number
}

export interface ReportsResponse {
    data: ReportsData
    message: string
    success: boolean
}
