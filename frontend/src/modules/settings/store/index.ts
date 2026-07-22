import { Module } from 'vuex'
import { SettingsState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const settingsStore: Module<SettingsState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
