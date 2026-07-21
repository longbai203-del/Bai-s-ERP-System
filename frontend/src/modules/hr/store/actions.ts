import { ActionTree } from 'vuex'
import { hrState } from './types'
import { hrMutations } from './types'

export const actions: ActionTree<hrState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(hrMutations.SET_LOADING, true)
            commit(hrMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await gethrList(params)
            // commit(hrMutations.SET_DATA, response.data)
            // commit(hrMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(hrMutations.SET_DATA, mockData)
            commit(hrMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(hrMutations.SET_LOADING, true)
            commit(hrMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await gethrDetail(id)
            // commit(hrMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(hrMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(hrMutations.SET_LOADING, true)
            commit(hrMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createhr(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(hrMutations.SET_LOADING, true)
            commit(hrMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updatehr(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(hrMutations.SET_LOADING, true)
            commit(hrMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deletehr(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(hrMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(hrMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(hrMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(hrMutations.RESET_STATE)
    }
}
