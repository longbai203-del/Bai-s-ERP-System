// dashboard 类型定义
export interface DashboardData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface DashboardListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface DashboardListResponse {
    data: DashboardData[]
    total: number
    page: number
    pageSize: number
}

export interface DashboardResponse {
    data: DashboardData
    message: string
    success: boolean
}
