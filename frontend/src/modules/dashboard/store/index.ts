import { Module } from 'vuex'
import { DashboardState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const dashboardStore: Module<DashboardState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
