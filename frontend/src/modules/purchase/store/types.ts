// purchase 模块状态类型定义

export interface purchaseState {
    loading: boolean
    error: string | null
    data: purchaseData[] | null
    currentItem: purchaseData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface purchaseData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface purchaseListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface purchaseCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface purchaseUpdateParams extends Partial<purchaseData> {
    id: number
}

export interface purchaseResponse {
    data: purchaseData
    message: string
    success: boolean
    code?: number
}

export interface purchaseListResponse {
    data: purchaseData[]
    total: number
    page: number
    pageSize: number
}

export type purchaseStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const purchaseMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type purchaseMutationTypes = typeof purchaseMutations[keyof typeof purchaseMutations]
