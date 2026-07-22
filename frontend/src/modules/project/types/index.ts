// project 类型定义
export interface ProjectData {
    id: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export interface ProjectListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
}

export interface ProjectListResponse {
    data: ProjectData[]
    total: number
    page: number
    pageSize: number
}

export interface ProjectResponse {
    data: ProjectData
    message: string
    success: boolean
}
