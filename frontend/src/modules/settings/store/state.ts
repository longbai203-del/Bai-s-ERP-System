import { SettingsState } from './types'

export const state = (): SettingsState => ({
    loading: false,
    error: null,
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
})
