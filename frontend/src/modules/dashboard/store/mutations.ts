import { MutationTree } from 'vuex'
import { dashboardState } from './types'
import { dashboardMutations } from './types'

export const mutations: MutationTree<dashboardState> = {
    [dashboardMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [dashboardMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [dashboardMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [dashboardMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [dashboardMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [dashboardMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [dashboardMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
