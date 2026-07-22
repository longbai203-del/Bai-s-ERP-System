// ai 类型定义
export interface AiData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface AiListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface AiListResponse {
    data: AiData[]
    total: number
    page: number
    pageSize: number
}

export interface AiResponse {
    data: AiData
    message: string
    success: boolean
}
