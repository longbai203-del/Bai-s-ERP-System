import { MutationTree } from 'vuex'
import { PurchaseState } from './types'
import { purchaseMutations } from './types'

export const mutations: MutationTree<PurchaseState> = {
    [purchaseMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [purchaseMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [purchaseMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [purchaseMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [purchaseMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [purchaseMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
