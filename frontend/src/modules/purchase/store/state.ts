import { PurchaseState } from './types'

export const state = (): PurchaseState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
