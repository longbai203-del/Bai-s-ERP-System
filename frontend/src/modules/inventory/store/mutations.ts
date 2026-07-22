import { MutationTree } from 'vuex'
import { InventoryState } from './types'
import { inventoryMutations } from './types'

export const mutations: MutationTree<InventoryState> = {
    [inventoryMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [inventoryMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [inventoryMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [inventoryMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [inventoryMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [inventoryMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
