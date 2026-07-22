// analytics 类型定义
export interface AnalyticsData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface AnalyticsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface AnalyticsListResponse {
    data: AnalyticsData[]
    total: number
    page: number
    pageSize: number
}

export interface AnalyticsResponse {
    data: AnalyticsData
    message: string
    success: boolean
}
