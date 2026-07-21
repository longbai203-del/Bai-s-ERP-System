import { MutationTree } from 'vuex'
import { reportsState } from './types'
import { reportsMutations } from './types'

export const mutations: MutationTree<reportsState> = {
    [reportsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [reportsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [reportsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [reportsMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
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
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
