import { MutationTree } from 'vuex'
import { ProductionState } from './types'
import { productionMutations } from './types'

export const mutations: MutationTree<ProductionState> = {
    [productionMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [productionMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [productionMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [productionMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [productionMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [productionMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
