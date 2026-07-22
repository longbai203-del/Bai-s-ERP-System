import { Module } from 'vuex'
import { PurchaseState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const purchaseStore: Module<PurchaseState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
