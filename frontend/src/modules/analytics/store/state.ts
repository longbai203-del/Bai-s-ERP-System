import { AnalyticsState } from './types'

export const state = (): AnalyticsState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
