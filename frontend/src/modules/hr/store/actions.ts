import { ActionTree } from 'vuex'
import { HrState } from './types'
import { hrMutations } from './types'

export const actions: ActionTree<HrState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(hrMutations.SET_LOADING, true)
        commit(hrMutations.SET_ERROR, null)
        try {
                        // const response = await getHrList(params)
            // commit(hrMutations.SET_DATA, response.data)
            // commit(hrMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message)
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(hrMutations.RESET_STATE)
    }
}

