import { ActionTree } from 'vuex'
import { PurchaseState } from './types'
import { purchaseMutations } from './types'

export const actions: ActionTree<PurchaseState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(purchaseMutations.SET_LOADING, true)
        commit(purchaseMutations.SET_ERROR, null)
        try {
                        // const response = await getPurchaseList(params)
            // commit(purchaseMutations.SET_DATA, response.data)
            // commit(purchaseMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(purchaseMutations.SET_ERROR, error.message)
        } finally {
            commit(purchaseMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(purchaseMutations.RESET_STATE)
    }
}

