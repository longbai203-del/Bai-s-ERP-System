import { ActionTree } from 'vuex'
import { systemState } from './types'
import { systemMutations } from './types'

export const actions: ActionTree<systemState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(systemMutations.SET_LOADING, true)
            commit(systemMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getsystemList(params)
            // commit(systemMutations.SET_DATA, response.data)
            // commit(systemMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(systemMutations.SET_DATA, mockData)
            commit(systemMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(systemMutations.SET_LOADING, true)
            commit(systemMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getsystemDetail(id)
            // commit(systemMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(systemMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(systemMutations.SET_LOADING, true)
            commit(systemMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createsystem(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(systemMutations.SET_LOADING, true)
            commit(systemMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updatesystem(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(systemMutations.SET_LOADING, true)
            commit(systemMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deletesystem(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(systemMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(systemMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(systemMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(systemMutations.RESET_STATE)
    }
}
