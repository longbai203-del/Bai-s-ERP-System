// approval 类型定义
export interface ApprovalData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface ApprovalListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ApprovalListResponse {
    data: ApprovalData[]
    total: number
    page: number
    pageSize: number
}

export interface ApprovalResponse {
    data: ApprovalData
    message: string
    success: boolean
}
