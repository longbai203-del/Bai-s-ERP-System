// settings 类型定义
export interface SettingsData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface SettingsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface SettingsListResponse {
    data: SettingsData[]
    total: number
    page: number
    pageSize: number
}

export interface SettingsResponse {
    data: SettingsData
    message: string
    success: boolean
}
