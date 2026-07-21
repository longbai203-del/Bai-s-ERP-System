import { ActionTree } from 'vuex'
import { productionState } from './types'
import { productionMutations } from './types'

export const actions: ActionTree<productionState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(productionMutations.SET_LOADING, true)
            commit(productionMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getproductionList(params)
            // commit(productionMutations.SET_DATA, response.data)
            // commit(productionMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(productionMutations.SET_DATA, mockData)
            commit(productionMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(productionMutations.SET_LOADING, true)
            commit(productionMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getproductionDetail(id)
            // commit(productionMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(productionMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(productionMutations.SET_LOADING, true)
            commit(productionMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createproduction(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(productionMutations.SET_LOADING, true)
            commit(productionMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updateproduction(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(productionMutations.SET_LOADING, true)
            commit(productionMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deleteproduction(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(productionMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(productionMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(productionMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(productionMutations.RESET_STATE)
    }
}
