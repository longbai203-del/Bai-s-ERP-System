// dashboard 模块状态类型定义

export interface dashboardState {
    loading: boolean
    error: string | null
    data: dashboardData[] | null
    currentItem: dashboardData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface dashboardData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface dashboardListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface dashboardCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface dashboardUpdateParams extends Partial<dashboardData> {
    id: number
}

export interface dashboardResponse {
    data: dashboardData
    message: string
    success: boolean
    code?: number
}

export interface dashboardListResponse {
    data: dashboardData[]
    total: number
    page: number
    pageSize: number
}

export type dashboardStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const dashboardMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type dashboardMutationTypes = typeof dashboardMutations[keyof typeof dashboardMutations]
