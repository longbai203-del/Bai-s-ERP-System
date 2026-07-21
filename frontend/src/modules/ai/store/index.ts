import { Module } from 'vuex'
import { aiState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const aiStore: Module<aiState, any> = {
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
