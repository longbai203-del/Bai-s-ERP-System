import { Module } from 'vuex'
import { reportsState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const reportsStore: Module<reportsState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
export { state } from './state'
export { mutations } from './mutations'
export { actions } from './actions'
export { getters } from './getters'
