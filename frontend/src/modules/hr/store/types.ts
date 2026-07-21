// hr 模块状态类型定义

export interface hrState {
    loading: boolean
    error: string | null
    data: hrData[] | null
    currentItem: hrData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface hrData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface hrListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface hrCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface hrUpdateParams extends Partial<hrData> {
    id: number
}

export interface hrResponse {
    data: hrData
    message: string
    success: boolean
    code?: number
}

export interface hrListResponse {
    data: hrData[]
    total: number
    page: number
    pageSize: number
}

export type hrStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const hrMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type hrMutationTypes = typeof hrMutations[keyof typeof hrMutations]
