import { MutationTree } from 'vuex'
import { OrdersState } from './types'
import { ordersMutations } from './types'

export const mutations: MutationTree<OrdersState> = {
    [ordersMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [ordersMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [ordersMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [ordersMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [ordersMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [ordersMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
