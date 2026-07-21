import { MutationTree } from 'vuex'
import { marketingState } from './types'
import { marketingMutations } from './types'

export const mutations: MutationTree<marketingState> = {
    [marketingMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [marketingMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [marketingMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [marketingMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [marketingMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [marketingMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [marketingMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
