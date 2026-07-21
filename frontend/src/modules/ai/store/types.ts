// ai 模块状态类型定义

export interface aiState {
    loading: boolean
    error: string | null
    data: aiData[] | null
    currentItem: aiData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface aiData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface aiListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface aiCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface aiUpdateParams extends Partial<aiData> {
    id: number
}

export interface aiResponse {
    data: aiData
    message: string
    success: boolean
    code?: number
}

export interface aiListResponse {
    data: aiData[]
    total: number
    page: number
    pageSize: number
}

export type aiStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const aiMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type aiMutationTypes = typeof aiMutations[keyof typeof aiMutations]
