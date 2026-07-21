import { MutationTree } from 'vuex'
import { settingsState } from './types'
import { settingsMutations } from './types'

export const mutations: MutationTree<settingsState> = {
    [settingsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [settingsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [settingsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [settingsMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [settingsMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [settingsMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [settingsMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
