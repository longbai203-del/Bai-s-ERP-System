// analytics 模块状态类型定义

export interface analyticsState {
    loading: boolean
    error: string | null
    data: analyticsData[] | null
    currentItem: analyticsData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface analyticsData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface analyticsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface analyticsCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface analyticsUpdateParams extends Partial<analyticsData> {
    id: number
}

export interface analyticsResponse {
    data: analyticsData
    message: string
    success: boolean
    code?: number
}

export interface analyticsListResponse {
    data: analyticsData[]
    total: number
    page: number
    pageSize: number
}

export type analyticsStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const analyticsMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type analyticsMutationTypes = typeof analyticsMutations[keyof typeof analyticsMutations]
