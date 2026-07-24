import { ActionTree } from 'vuex'
import { FinanceState } from './types'
import { financeMutations } from './types'

export const actions: ActionTree<FinanceState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(financeMutations.SET_LOADING, true)
        commit(financeMutations.SET_ERROR, null)
        try {
                        // const response = await getFinanceList(params)
            // commit(financeMutations.SET_DATA, response.data)
            // commit(financeMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message)
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(financeMutations.RESET_STATE)
    }
}

