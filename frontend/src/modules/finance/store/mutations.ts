import { MutationTree } from 'vuex'
import { FinanceState } from './types'
import { financeMutations } from './types'

export const mutations: MutationTree<FinanceState> = {
    [financeMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [financeMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [financeMutations.SET_DATA](state, data: any[]) {
        state.data = data
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
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
