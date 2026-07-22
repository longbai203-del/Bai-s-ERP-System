import { MarketingState } from './types'

export const state = (): MarketingState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
