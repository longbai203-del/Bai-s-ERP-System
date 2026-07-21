import { ActionTree } from 'vuex'
import { approvalState } from './types'
import { approvalMutations } from './types'

export const actions: ActionTree<approvalState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(approvalMutations.SET_LOADING, true)
            commit(approvalMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getapprovalList(params)
            // commit(approvalMutations.SET_DATA, response.data)
            // commit(approvalMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(approvalMutations.SET_DATA, mockData)
            commit(approvalMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(approvalMutations.SET_LOADING, true)
            commit(approvalMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getapprovalDetail(id)
            // commit(approvalMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(approvalMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(approvalMutations.SET_LOADING, true)
            commit(approvalMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createapproval(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(approvalMutations.SET_LOADING, true)
            commit(approvalMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updateapproval(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(approvalMutations.SET_LOADING, true)
            commit(approvalMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deleteapproval(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(approvalMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(approvalMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(approvalMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(approvalMutations.RESET_STATE)
    }
}
