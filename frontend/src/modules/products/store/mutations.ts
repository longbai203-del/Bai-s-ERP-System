import { MutationTree } from 'vuex'
import { productsState } from './types'
import { productsMutations } from './types'

export const mutations: MutationTree<productsState> = {
    [productsMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [productsMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [productsMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [productsMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [productsMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [productsMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [productsMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
