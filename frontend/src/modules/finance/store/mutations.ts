import { MutationTree } from 'vuex'
import { financeState } from './types'
import { financeMutations } from './types'

export const mutations: MutationTree<financeState> = {
    [financeMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [financeMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [financeMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [financeMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [financeMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [financeMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [financeMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
