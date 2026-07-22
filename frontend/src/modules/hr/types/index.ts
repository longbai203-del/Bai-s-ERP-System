// hr 类型定义
export interface HrData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface HrListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface HrListResponse {
    data: HrData[]
    total: number
    page: number
    pageSize: number
}

export interface HrResponse {
    data: HrData
    message: string
    success: boolean
}
