import { financeState } from './types'

export const state = (): financeState => ({
    loading: false,
    error: null,
    data: null,
    currentItem: null,
    total: 0,
    currentPage: 1,
    pageSize: 10
})
