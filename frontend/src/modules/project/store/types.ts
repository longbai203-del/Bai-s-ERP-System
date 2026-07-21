// project 模块状态类型定义

export interface projectState {
    loading: boolean
    error: string | null
    data: projectData[] | null
    currentItem: projectData | null
    total: number
    currentPage: number
    pageSize: number
}

export interface projectData {
    id: number
    name: string
    code?: string
    status?: string
    createdAt?: string
    updatedAt?: string
    remark?: string
}

export interface projectListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    startTime?: string
    endTime?: string
}

export interface projectCreateParams {
    name: string
    code?: string
    status?: string
    remark?: string
}

export interface projectUpdateParams extends Partial<projectData> {
    id: number
}

export interface projectResponse {
    data: projectData
    message: string
    success: boolean
    code?: number
}

export interface projectListResponse {
    data: projectData[]
    total: number
    page: number
    pageSize: number
}

export type projectStatus = 'active' | 'inactive' | 'pending' | 'deleted'

export const projectMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const

export type projectMutationTypes = typeof projectMutations[keyof typeof projectMutations]
