// products 模块状态类型定义

export interface productsState {
    loading: boolean
    error: string | null
    data: productsData[] | null
    currentItem: productsData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface productsData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface productsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface productsCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface productsUpdateParams extends Partial<productsData> {
    id: number
}

export interface productsResponse {
    data: productsData
    message: string
    success: boolean
    code?: number
}

export interface productsListResponse {
    data: productsData[]
    total: number
    page: number
    pageSize: number
}

export type productsStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const productsMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type productsMutationTypes = typeof productsMutations[keyof typeof productsMutations]
