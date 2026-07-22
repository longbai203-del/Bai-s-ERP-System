import { MutationTree } from 'vuex'
import { AnalyticsState } from './types'
import { analyticsMutations } from './types'

export const mutations: MutationTree<AnalyticsState> = {
    [analyticsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [analyticsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [analyticsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [analyticsMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [analyticsMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [analyticsMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
