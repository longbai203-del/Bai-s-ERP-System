import { MutationTree } from 'vuex'
import { analyticsState } from './types'
import { analyticsMutations } from './types'

export const mutations: MutationTree<analyticsState> = {
    [analyticsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [analyticsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [analyticsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [analyticsMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
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
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
