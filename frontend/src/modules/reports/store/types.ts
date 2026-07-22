// reports Store 类型定义
export interface ReportsState {
    loading: boolean
    error: string | null
    data: any[]
    total: number
    currentPage: number
    pageSize: number
}

export const reportsMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const
