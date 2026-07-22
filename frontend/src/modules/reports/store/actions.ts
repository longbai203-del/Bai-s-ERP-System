import { ActionTree } from 'vuex'
import { ReportsState } from './types'
import { reportsMutations } from './types'

export const actions: ActionTree<ReportsState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(reportsMutations.SET_LOADING, true)
        commit(reportsMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getReportsList(params)
            // commit(reportsMutations.SET_DATA, response.data)
            // commit(reportsMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(reportsMutations.SET_ERROR, error.message)
        } finally {
            commit(reportsMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(reportsMutations.RESET_STATE)
    }
}
