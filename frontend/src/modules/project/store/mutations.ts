import { MutationTree } from 'vuex'
import { ProjectState } from './types'
import { projectMutations } from './types'

export const mutations: MutationTree<ProjectState> = {
    [projectMutations.SET_LOADING](state, loading: boolean) {
        state.loading = loading
    },
    [projectMutations.SET_ERROR](state, error: string | null) {
        state.error = error
    },
    [projectMutations.SET_DATA](state, data: any[]) {
        state.data = data
    },
    [projectMutations.SET_TOTAL](state, total: number) {
        state.total = total
    },
    [projectMutations.SET_PAGE](state, { page, pageSize }: { page: number; pageSize: number }) {
        state.currentPage = page
        state.pageSize = pageSize
    },
    [projectMutations.RESET_STATE](state) {
        state.loading = false
        state.error = null
        state.data = []
        state.total = 0
        state.currentPage = 1
        state.pageSize = 10
    }
}
