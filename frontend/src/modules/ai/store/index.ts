import { Module } from 'vuex'
import { AiState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const aiStore: Module<AiState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
