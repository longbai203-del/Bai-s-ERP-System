// finance 模块状态类型定义

export interface financeState {
    loading: boolean
    error: string | null
    data: financeData[] | null
    currentItem: financeData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface financeData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface financeListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface financeCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface financeUpdateParams extends Partial<financeData> {
    id: number
}

export interface financeResponse {
    data: financeData
    message: string
    success: boolean
    code?: number
}

export interface financeListResponse {
    data: financeData[]
    total: number
    page: number
    pageSize: number
}

export type financeStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const financeMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type financeMutationTypes = typeof financeMutations[keyof typeof financeMutations]
