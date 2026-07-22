import { Module } from 'vuex'
import { PosState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const posStore: Module<PosState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
