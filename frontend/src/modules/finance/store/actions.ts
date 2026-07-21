import { ActionTree } from 'vuex'
import { financeState } from './types'
import { financeMutations } from './types'

export const actions: ActionTree<financeState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(financeMutations.SET_LOADING, true)
            commit(financeMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getfinanceList(params)
            // commit(financeMutations.SET_DATA, response.data)
            // commit(financeMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(financeMutations.SET_DATA, mockData)
            commit(financeMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(financeMutations.SET_LOADING, true)
            commit(financeMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getfinanceDetail(id)
            // commit(financeMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(financeMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(financeMutations.SET_LOADING, true)
            commit(financeMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createfinance(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(financeMutations.SET_LOADING, true)
            commit(financeMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updatefinance(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(financeMutations.SET_LOADING, true)
            commit(financeMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deletefinance(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(financeMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(financeMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(financeMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(financeMutations.RESET_STATE)
    }
}
