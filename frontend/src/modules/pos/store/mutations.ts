import { MutationTree } from 'vuex'
import { PosState } from './types'
import { posMutations } from './types'

export const mutations: MutationTree<PosState> = {
    [posMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [posMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [posMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [posMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [posMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [posMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
