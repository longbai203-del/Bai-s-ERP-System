import { Module } from 'vuex'
import { FinanceState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const financeStore: Module<FinanceState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
