import { approvalState } from './types'

export const state = (): approvalState => ({
    loading: false,
    error: null,
    data: null,
    currentItem: null,
    total: 0,
    currentPage: 1,
    pageSize: 10
})
