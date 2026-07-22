import { MutationTree } from 'vuex'
import { ReportsState } from './types'
import { reportsMutations } from './types'

export const mutations: MutationTree<ReportsState> = {
    [reportsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [reportsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [reportsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [reportsMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [reportsMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [reportsMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
