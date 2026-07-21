import { MutationTree } from 'vuex'
import { saasState } from './types'
import { saasMutations } from './types'

export const mutations: MutationTree<saasState> = {
    [saasMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [saasMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [saasMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [saasMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
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
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
