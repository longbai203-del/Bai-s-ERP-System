// system 类型定义
export interface SystemData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface SystemListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface SystemListResponse {
    data: SystemData[]
    total: number
    page: number
    pageSize: number
}

export interface SystemResponse {
    data: SystemData
    message: string
    success: boolean
}
