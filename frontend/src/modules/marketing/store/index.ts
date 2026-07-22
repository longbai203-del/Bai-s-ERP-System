import { Module } from 'vuex'
import { MarketingState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const marketingStore: Module<MarketingState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
