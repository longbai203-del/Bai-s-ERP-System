import { CustomersState } from './types'

export const state = (): CustomersState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
