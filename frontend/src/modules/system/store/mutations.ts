import { MutationTree } from 'vuex'
import { SystemState } from './types'
import { systemMutations } from './types'

export const mutations: MutationTree<SystemState> = {
    [systemMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [systemMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [systemMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [systemMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [systemMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [systemMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
