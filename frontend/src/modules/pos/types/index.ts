// pos 类型定义
export interface PosData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface PosListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface PosListResponse {
    data: PosData[]
    total: number
    page: number
    pageSize: number
}

export interface PosResponse {
    data: PosData
    message: string
    success: boolean
}
