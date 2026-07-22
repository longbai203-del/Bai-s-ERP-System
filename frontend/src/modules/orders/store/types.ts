// orders Store 类型定义
export interface OrdersState {
    loading: boolean
    error: string | null
    data: any[]
    total: number
    currentPage: number
    pageSize: number
}

export const ordersMutations = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_TOTAL: 'SET_TOTAL',
    SET_PAGE: 'SET_PAGE',
    RESET_STATE: 'RESET_STATE'
} as const
