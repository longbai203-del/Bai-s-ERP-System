import { Module } from 'vuex'
import { ApprovalState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const approvalStore: Module<ApprovalState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
