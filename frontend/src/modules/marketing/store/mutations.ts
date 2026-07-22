import { MutationTree } from 'vuex'
import { MarketingState } from './types'
import { marketingMutations } from './types'

export const mutations: MutationTree<MarketingState> = {
    [marketingMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [marketingMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [marketingMutations.SET_DATA](state, data: any[]) {
        state.data = data
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
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
