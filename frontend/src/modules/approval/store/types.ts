// approval 模块状态类型定义

export interface approvalState {
    loading: boolean
    error: string | null
    data: approvalData[] | null
    currentItem: approvalData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface approvalData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface approvalListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface approvalCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface approvalUpdateParams extends Partial<approvalData> {
    id: number
}

export interface approvalResponse {
    data: approvalData
    message: string
    success: boolean
    code?: number
}

export interface approvalListResponse {
    data: approvalData[]
    total: number
    page: number
    pageSize: number
}

export type approvalStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const approvalMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type approvalMutationTypes = typeof approvalMutations[keyof typeof approvalMutations]
