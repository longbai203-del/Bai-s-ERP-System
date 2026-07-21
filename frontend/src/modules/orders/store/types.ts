// orders 模块状态类型定义

export interface ordersState {
    loading: boolean
    error: string | null
    data: ordersData[] | null
    currentItem: ordersData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface ordersData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface ordersListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface ordersCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface ordersUpdateParams extends Partial<ordersData> {
    id: number
}

export interface ordersResponse {
    data: ordersData
    message: string
    success: boolean
    code?: number
}

export interface ordersListResponse {
    data: ordersData[]
    total: number
    page: number
    pageSize: number
}

export type ordersStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const ordersMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type ordersMutationTypes = typeof ordersMutations[keyof typeof ordersMutations]
