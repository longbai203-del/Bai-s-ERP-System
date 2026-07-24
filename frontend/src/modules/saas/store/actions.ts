import { ActionTree } from 'vuex'
import { SaasState } from './types'
import { saasMutations } from './types'

export const actions: ActionTree<SaasState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(saasMutations.SET_LOADING, true)
        commit(saasMutations.SET_ERROR, null)
        try {
                        // const response = await getSaasList(params)
            // commit(saasMutations.SET_DATA, response.data)
            // commit(saasMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(saasMutations.SET_ERROR, error.message)
        } finally {
            commit(saasMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(saasMutations.RESET_STATE)
    }
}

