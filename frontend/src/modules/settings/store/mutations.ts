import { MutationTree } from 'vuex'
import { SettingsState } from './types'
import { settingsMutations } from './types'

export const mutations: MutationTree<SettingsState> = {
    [settingsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [settingsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [settingsMutations.SET_DATA](state, data: any[]) {
        state.data = data
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
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
