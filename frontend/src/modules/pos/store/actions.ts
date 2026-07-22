import { ActionTree } from 'vuex'
import { PosState } from './types'
import { posMutations } from './types'

export const actions: ActionTree<PosState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(posMutations.SET_LOADING, true)
        commit(posMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getPosList(params)
            // commit(posMutations.SET_DATA, response.data)
            // commit(posMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(posMutations.SET_ERROR, error.message)
        } finally {
            commit(posMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(posMutations.RESET_STATE)
    }
}
