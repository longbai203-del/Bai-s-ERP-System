import { Module } from 'vuex'
import { ProductsState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const productsStore: Module<ProductsState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
