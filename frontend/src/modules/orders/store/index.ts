import { Module } from 'vuex'
import { OrdersState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const ordersStore: Module<OrdersState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
