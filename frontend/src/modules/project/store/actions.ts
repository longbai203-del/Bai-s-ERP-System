import { ActionTree } from 'vuex'
import { ProjectState } from './types'
import { projectMutations } from './types'

export const actions: ActionTree<ProjectState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(projectMutations.SET_LOADING, true)
        commit(projectMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getProjectList(params)
            // commit(projectMutations.SET_DATA, response.data)
            // commit(projectMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message)
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(projectMutations.RESET_STATE)
    }
}
