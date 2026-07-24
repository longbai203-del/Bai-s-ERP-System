import { ActionTree } from 'vuex'
import { SettingsState } from './types'
import { settingsMutations } from './types'

export const actions: ActionTree<SettingsState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(settingsMutations.SET_LOADING, true)
        commit(settingsMutations.SET_ERROR, null)
        try {
                        // const response = await getSettingsList(params)
            // commit(settingsMutations.SET_DATA, response.data)
            // commit(settingsMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message)
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(settingsMutations.RESET_STATE)
    }
}

