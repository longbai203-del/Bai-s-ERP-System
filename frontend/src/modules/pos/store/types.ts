// pos 模块状态类型定义

export interface posState {
    loading: boolean
    error: string | null
    data: posData[] | null
    currentItem: posData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface posData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface posListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface posCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface posUpdateParams extends Partial<posData> {
    id: number
}

export interface posResponse {
    data: posData
    message: string
    success: boolean
    code?: number
}

export interface posListResponse {
    data: posData[]
    total: number
    page: number
    pageSize: number
}

export type posStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const posMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type posMutationTypes = typeof posMutations[keyof typeof posMutations]
