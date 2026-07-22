import { ActionTree } from 'vuex'
import { InventoryState } from './types'
import { inventoryMutations } from './types'

export const actions: ActionTree<InventoryState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(inventoryMutations.SET_LOADING, true)
        commit(inventoryMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getInventoryList(params)
            // commit(inventoryMutations.SET_DATA, response.data)
            // commit(inventoryMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(inventoryMutations.SET_ERROR, error.message)
        } finally {
            commit(inventoryMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(inventoryMutations.RESET_STATE)
    }
}
