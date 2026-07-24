import { ActionTree } from 'vuex'
import { ProductsState } from './types'
import { productsMutations } from './types'

export const actions: ActionTree<ProductsState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(productsMutations.SET_LOADING, true)
        commit(productsMutations.SET_ERROR, null)
        try {
                        // const response = await getProductsList(params)
            // commit(productsMutations.SET_DATA, response.data)
            // commit(productsMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message)
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(productsMutations.RESET_STATE)
    }
}

