import { ActionTree } from 'vuex'
import { SystemState } from './types'
import { systemMutations } from './types'

export const actions: ActionTree<SystemState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(systemMutations.SET_LOADING, true)
        commit(systemMutations.SET_ERROR, null)
        try {
                        // const response = await getSystemList(params)
            // commit(systemMutations.SET_DATA, response.data)
            // commit(systemMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message)
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(systemMutations.RESET_STATE)
    }
}

