// saas 模块状态类型定义

export interface saasState {
    loading: boolean
    error: string | null
    data: saasData[] | null
    currentItem: saasData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface saasData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface saasListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface saasCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface saasUpdateParams extends Partial<saasData> {
    id: number
}

export interface saasResponse {
    data: saasData
    message: string
    success: boolean
    code?: number
}

export interface saasListResponse {
    data: saasData[]
    total: number
    page: number
    pageSize: number
}

export type saasStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const saasMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type saasMutationTypes = typeof saasMutations[keyof typeof saasMutations]
