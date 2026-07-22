import { Module } from 'vuex'
import { HrState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const hrStore: Module<HrState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
