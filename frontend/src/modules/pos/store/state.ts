import { PosState } from './types'

export const state = (): PosState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
