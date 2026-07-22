import { ActionTree } from 'vuex'
import { AiState } from './types'
import { aiMutations } from './types'

export const actions: ActionTree<AiState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(aiMutations.SET_LOADING, true)
        commit(aiMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getAiList(params)
            // commit(aiMutations.SET_DATA, response.data)
            // commit(aiMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(aiMutations.SET_ERROR, error.message)
        } finally {
            commit(aiMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(aiMutations.RESET_STATE)
    }
}
