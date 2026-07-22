import { ActionTree } from 'vuex'
import { AnalyticsState } from './types'
import { analyticsMutations } from './types'

export const actions: ActionTree<AnalyticsState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(analyticsMutations.SET_LOADING, true)
        commit(analyticsMutations.SET_ERROR, null)
        try {
            // TODO: 调用 API
            // const response = await getAnalyticsList(params)
            // commit(analyticsMutations.SET_DATA, response.data)
            // commit(analyticsMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(analyticsMutations.SET_ERROR, error.message)
        } finally {
            commit(analyticsMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(analyticsMutations.RESET_STATE)
    }
}
