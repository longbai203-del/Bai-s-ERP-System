import { MutationTree } from 'vuex'
import { hrState } from './types'
import { hrMutations } from './types'

export const mutations: MutationTree<hrState> = {
    [hrMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [hrMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [hrMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [hrMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [hrMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [hrMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [hrMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
