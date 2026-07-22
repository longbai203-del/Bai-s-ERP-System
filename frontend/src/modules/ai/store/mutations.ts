import { MutationTree } from 'vuex'
import { AiState } from './types'
import { aiMutations } from './types'

export const mutations: MutationTree<AiState> = {
    [aiMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [aiMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [aiMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [aiMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [aiMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [aiMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
