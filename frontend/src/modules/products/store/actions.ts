import { ActionTree } from 'vuex'
import { productsState } from './types'
import { productsMutations } from './types'

export const actions: ActionTree<productsState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(productsMutations.SET_LOADING, true)
            commit(productsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getproductsList(params)
            // commit(productsMutations.SET_DATA, response.data)
            // commit(productsMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(productsMutations.SET_DATA, mockData)
            commit(productsMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(productsMutations.SET_LOADING, true)
            commit(productsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getproductsDetail(id)
            // commit(productsMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(productsMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(productsMutations.SET_LOADING, true)
            commit(productsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createproducts(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(productsMutations.SET_LOADING, true)
            commit(productsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updateproducts(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(productsMutations.SET_LOADING, true)
            commit(productsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deleteproducts(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(productsMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(productsMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(productsMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(productsMutations.RESET_STATE)
    }
}
