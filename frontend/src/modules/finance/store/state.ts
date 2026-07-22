import { FinanceState } from './types'

export const state = (): FinanceState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
