import { ActionTree } from 'vuex'
import { OrdersState } from './types'
import { ordersMutations } from './types'

export const actions: ActionTree<OrdersState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(ordersMutations.SET_LOADING, true)
        commit(ordersMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getOrdersList(params)
            // commit(ordersMutations.SET_DATA, response.data)
            // commit(ordersMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(ordersMutations.SET_ERROR, error.message)
        } finally {
            commit(ordersMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(ordersMutations.RESET_STATE)
    }
}
