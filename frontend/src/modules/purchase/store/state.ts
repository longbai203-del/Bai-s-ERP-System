import { purchaseState } from './types'

export const state = (): purchaseState => ({
    loading: false,
    error: null,
    data: null,
    currentItem: null,
    total: 0,
    currentPage: 1,
    pageSize: 10
})
