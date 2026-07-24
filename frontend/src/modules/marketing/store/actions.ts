import { ActionTree } from 'vuex'
import { MarketingState } from './types'
import { marketingMutations } from './types'

export const actions: ActionTree<MarketingState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(marketingMutations.SET_LOADING, true)
        commit(marketingMutations.SET_ERROR, null)
        try {
                        // const response = await getMarketingList(params)
            // commit(marketingMutations.SET_DATA, response.data)
            // commit(marketingMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(marketingMutations.SET_ERROR, error.message)
        } finally {
            commit(marketingMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(marketingMutations.RESET_STATE)
    }
}

