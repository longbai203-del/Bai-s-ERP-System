// system 模块状态类型定义

export interface systemState {
    loading: boolean
    error: string | null
    data: systemData[] | null
    currentItem: systemData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface systemData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface systemListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface systemCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface systemUpdateParams extends Partial<systemData> {
    id: number
}

export interface systemResponse {
    data: systemData
    message: string
    success: boolean
    code?: number
}

export interface systemListResponse {
    data: systemData[]
    total: number
    page: number
    pageSize: number
}

export type systemStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const systemMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type systemMutationTypes = typeof systemMutations[keyof typeof systemMutations]
