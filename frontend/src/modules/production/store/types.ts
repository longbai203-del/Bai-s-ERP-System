// production 模块状态类型定义

export interface productionState {
    loading: boolean
    error: string | null
    data: productionData[] | null
    currentItem: productionData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface productionData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface productionListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface productionCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface productionUpdateParams extends Partial<productionData> {
    id: number
}

export interface productionResponse {
    data: productionData
    message: string
    success: boolean
    code?: number
}

export interface productionListResponse {
    data: productionData[]
    total: number
    page: number
    pageSize: number
}

export type productionStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const productionMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type productionMutationTypes = typeof productionMutations[keyof typeof productionMutations]
