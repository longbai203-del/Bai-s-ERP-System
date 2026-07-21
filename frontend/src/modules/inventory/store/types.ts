// inventory 模块状态类型定义

export interface inventoryState {
    loading: boolean
    error: string | null
    data: inventoryData[] | null
    currentItem: inventoryData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface inventoryData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface inventoryListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface inventoryCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface inventoryUpdateParams extends Partial<inventoryData> {
    id: number
}

export interface inventoryResponse {
    data: inventoryData
    message: string
    success: boolean
    code?: number
}

export interface inventoryListResponse {
    data: inventoryData[]
    total: number
    page: number
    pageSize: number
}

export type inventoryStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const inventoryMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type inventoryMutationTypes = typeof inventoryMutations[keyof typeof inventoryMutations]
