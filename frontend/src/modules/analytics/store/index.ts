import { Module } from 'vuex'
import { AnalyticsState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const analyticsStore: Module<AnalyticsState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
