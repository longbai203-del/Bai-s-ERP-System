// reports 模块状态类型定义

export interface reportsState {
    loading: boolean
    error: string | null
    data: reportsData[] | null
    currentItem: reportsData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface reportsData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface reportsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface reportsCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface reportsUpdateParams extends Partial<reportsData> {
    id: number
}

export interface reportsResponse {
    data: reportsData
    message: string
    success: boolean
    code?: number
}

export interface reportsListResponse {
    data: reportsData[]
    total: number
    page: number
    pageSize: number
}

export type reportsStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const reportsMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type reportsMutationTypes = typeof reportsMutations[keyof typeof reportsMutations]
