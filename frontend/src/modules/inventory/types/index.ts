// inventory 类型定义
export interface InventoryData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface InventoryListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface InventoryListResponse {
    data: InventoryData[]
    total: number
    page: number
    pageSize: number
}

export interface InventoryResponse {
    data: InventoryData
    message: string
    success: boolean
}
