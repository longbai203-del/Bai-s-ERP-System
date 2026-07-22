import { Module } from 'vuex'
import { ProductionState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const productionStore: Module<ProductionState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
