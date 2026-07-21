import { ActionTree } from 'vuex'
import { projectState } from './types'
import { projectMutations } from './types'

export const actions: ActionTree<projectState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(projectMutations.SET_LOADING, true)
            commit(projectMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getprojectList(params)
            // commit(projectMutations.SET_DATA, response.data)
            // commit(projectMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(projectMutations.SET_DATA, mockData)
            commit(projectMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(projectMutations.SET_LOADING, true)
            commit(projectMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getprojectDetail(id)
            // commit(projectMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(projectMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(projectMutations.SET_LOADING, true)
            commit(projectMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createproject(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(projectMutations.SET_LOADING, true)
            commit(projectMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updateproject(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(projectMutations.SET_LOADING, true)
            commit(projectMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deleteproject(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(projectMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(projectMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(projectMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(projectMutations.RESET_STATE)
    }
}
