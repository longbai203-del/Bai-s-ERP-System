import { MutationTree } from 'vuex'
import { systemState } from './types'
import { systemMutations } from './types'

export const mutations: MutationTree<systemState> = {
    [systemMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [systemMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [systemMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [systemMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [systemMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [systemMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [systemMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
