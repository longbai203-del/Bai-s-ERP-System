// marketing 模块状态类型定义

export interface marketingState {
    loading: boolean
    error: string | null
    data: marketingData[] | null
    currentItem: marketingData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface marketingData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface marketingListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface marketingCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface marketingUpdateParams extends Partial<marketingData> {
    id: number
}

export interface marketingResponse {
    data: marketingData
    message: string
    success: boolean
    code?: number
}

export interface marketingListResponse {
    data: marketingData[]
    total: number
    page: number
    pageSize: number
}

export type marketingStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const marketingMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type marketingMutationTypes = typeof marketingMutations[keyof typeof marketingMutations]
