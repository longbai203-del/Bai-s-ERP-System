import { ActionTree } from 'vuex'
import { CustomersState } from './types'
import { customersMutations } from './types'

export const actions: ActionTree<CustomersState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(customersMutations.SET_LOADING, true)
        commit(customersMutations.SET_ERROR, null)
        try {
                        // const response = await getCustomersList(params)
            // commit(customersMutations.SET_DATA, response.data)
            // commit(customersMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message)
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(customersMutations.RESET_STATE)
    }
}

