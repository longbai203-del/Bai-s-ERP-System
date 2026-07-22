import { ProductionState } from './types'

export const state = (): ProductionState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
