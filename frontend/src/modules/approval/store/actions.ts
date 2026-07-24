import { ActionTree } from 'vuex'
import { ApprovalState } from './types'
import { approvalMutations } from './types'

export const actions: ActionTree<ApprovalState, any> = {
    async fetchData({ commit }, params?: any) {
        commit(approvalMutations.SET_LOADING, true)
        commit(approvalMutations.SET_ERROR, null)
        try {
                        // const response = await getApprovalList(params)
            // commit(approvalMutations.SET_DATA, response.data)
            // commit(approvalMutations.SET_TOTAL, response.total)
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message)
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    resetState({ commit }) {
        commit(approvalMutations.RESET_STATE)
    }
}

