import { Module } from 'vuex'
import { InventoryState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const inventoryStore: Module<InventoryState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
