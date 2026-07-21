// settings 模块状态类型定义

export interface settingsState {
    loading: boolean
    error: string | null
    data: settingsData[] | null
    currentItem: settingsData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface settingsData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface settingsListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface settingsCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface settingsUpdateParams extends Partial<settingsData> {
    id: number
}

export interface settingsResponse {
    data: settingsData
    message: string
    success: boolean
    code?: number
}

export interface settingsListResponse {
    data: settingsData[]
    total: number
    page: number
    pageSize: number
}

export type settingsStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const settingsMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type settingsMutationTypes = typeof settingsMutations[keyof typeof settingsMutations]
