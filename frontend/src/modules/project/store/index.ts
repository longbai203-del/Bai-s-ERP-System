import { Module } from 'vuex'
import { ProjectState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const projectStore: Module<ProjectState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
