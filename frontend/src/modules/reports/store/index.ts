import { Module } from 'vuex'
import { ReportsState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const reportsStore: Module<ReportsState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
