import { ActionTree } from 'vuex'
import { DashboardState } from './types'
import { dashboardMutations } from './types'

export const actions: ActionTree<DashboardState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(dashboardMutations.SET_LOADING, true)
        commit(dashboardMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getDashboardList(params)
            // commit(dashboardMutations.SET_DATA, response.data)
            // commit(dashboardMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(dashboardMutations.SET_ERROR, error.message)
        } finally {
            commit(dashboardMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(dashboardMutations.RESET_STATE)
    }
}
