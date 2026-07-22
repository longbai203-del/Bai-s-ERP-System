// finance 类型定义
export interface FinanceData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface FinanceListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface FinanceListResponse {
    data: FinanceData[]
    total: number
    page: number
    pageSize: number
}

export interface FinanceResponse {
    data: FinanceData
    message: string
    success: boolean
}
