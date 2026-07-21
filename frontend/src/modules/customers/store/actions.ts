import { ActionTree } from 'vuex'
import { customersState } from './types'
import { customersMutations } from './types'

export const actions: ActionTree<customersState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(customersMutations.SET_LOADING, true)
            commit(customersMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getcustomersList(params)
            // commit(customersMutations.SET_DATA, response.data)
            // commit(customersMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(customersMutations.SET_DATA, mockData)
            commit(customersMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(customersMutations.SET_LOADING, true)
            commit(customersMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getcustomersDetail(id)
            // commit(customersMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(customersMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(customersMutations.SET_LOADING, true)
            commit(customersMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createcustomers(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(customersMutations.SET_LOADING, true)
            commit(customersMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updatecustomers(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(customersMutations.SET_LOADING, true)
            commit(customersMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deletecustomers(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(customersMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(customersMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(customersMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(customersMutations.RESET_STATE)
    }
}
