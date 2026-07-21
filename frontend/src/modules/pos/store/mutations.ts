import { MutationTree } from 'vuex'
import { posState } from './types'
import { posMutations } from './types'

export const mutations: MutationTree<posState> = {
    [posMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [posMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [posMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [posMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [posMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [posMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [posMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
