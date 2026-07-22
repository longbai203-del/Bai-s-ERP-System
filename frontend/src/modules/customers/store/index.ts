import { Module } from 'vuex'
import { CustomersState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const customersStore: Module<CustomersState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
