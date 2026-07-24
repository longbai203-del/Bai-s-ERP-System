import { ActionTree } from 'vuex'
import { ProductionState } from './types'
import { productionMutations } from './types'

export const actions: ActionTree<ProductionState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(productionMutations.SET_LOADING, true)
        commit(productionMutations.SET_ERROR, null)
        try {
                        // const response = await getProductionList(params)
            // commit(productionMutations.SET_DATA, response.data)
            // commit(productionMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message)
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(productionMutations.RESET_STATE)
    }
}

