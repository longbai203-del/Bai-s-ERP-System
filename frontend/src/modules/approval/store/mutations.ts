import { MutationTree } from 'vuex'
import { approvalState } from './types'
import { approvalMutations } from './types'

export const mutations: MutationTree<approvalState> = {
    [approvalMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [approvalMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [approvalMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [approvalMutations.SET_CURRENT_ITEM](state, item: any) {
        state.currentItem = item
    },
    [approvalMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [approvalMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [approvalMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = null
        state.currentItem = null
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
