import { MutationTree } from 'vuex'
import { CustomersState } from './types'
import { customersMutations } from './types'

export const mutations: MutationTree<CustomersState> = {
    [customersMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [customersMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [customersMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [customersMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [customersMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [customersMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
