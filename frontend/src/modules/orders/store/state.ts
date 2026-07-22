import { OrdersState } from './types'

export const state = (): OrdersState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
