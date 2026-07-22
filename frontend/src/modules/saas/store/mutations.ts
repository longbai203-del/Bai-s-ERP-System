import { MutationTree } from 'vuex'
import { SaasState } from './types'
import { saasMutations } from './types'

export const mutations: MutationTree<SaasState> = {
    [saasMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [saasMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [saasMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [saasMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [saasMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [saasMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
