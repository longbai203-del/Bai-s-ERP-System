import { ActionTree } from 'vuex'
import { settingsState } from './types'
import { settingsMutations } from './types'

export const actions: ActionTree<settingsState, any> = {
    async fetchData({ commit }, params?: any) {
        try {
            commit(settingsMutations.SET_LOADING, true)
            commit(settingsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getsettingsList(params)
            // commit(settingsMutations.SET_DATA, response.data)
            // commit(settingsMutations.SET_TOTAL, response.total)
            
            // 示例数据
            const mockData = [
                { id: 1, name: '示例数据 1', createdAt: new Date().toISOString() },
                { id: 2, name: '示例数据 2', createdAt: new Date().toISOString() }
            ]
            commit(settingsMutations.SET_DATA, mockData)
            commit(settingsMutations.SET_TOTAL, mockData.length)
            
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message || '获取数据失败')
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    
    async fetchDetail({ commit }, id: number) {
        try {
            commit(settingsMutations.SET_LOADING, true)
            commit(settingsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await getsettingsDetail(id)
            // commit(settingsMutations.SET_CURRENT_ITEM, response.data)
            
            const mockItem = { id, name: '示例详情', createdAt: new Date().toISOString() }
            commit(settingsMutations.SET_CURRENT_ITEM, mockItem)
            
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message || '获取详情失败')
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    
    async createData({ commit }, data: any) {
        try {
            commit(settingsMutations.SET_LOADING, true)
            commit(settingsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await createsettings(data)
            // return response
            
            return { success: true, data: { id: Date.now(), ...data } }
            
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message || '创建失败')
            throw error
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    
    async updateData({ commit }, { id, data }: { id: number; data: any }) {
        try {
            commit(settingsMutations.SET_LOADING, true)
            commit(settingsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await updatesettings(id, data)
            // return response
            
            return { success: true, data: { id, ...data } }
            
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message || '更新失败')
            throw error
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    
    async deleteData({ commit }, id: number) {
        try {
            commit(settingsMutations.SET_LOADING, true)
            commit(settingsMutations.SET_ERROR, null)
            
            // TODO: 替换为实际的 API 调用
            // const response = await deletesettings(id)
            // return response
            
            return { success: true }
            
        } catch (error: any) {
            commit(settingsMutations.SET_ERROR, error.message || '删除失败')
            throw error
        } finally {
            commit(settingsMutations.SET_LOADING, false)
        }
    },
    
    setPage({ commit }, { page, pageSize }: { page: number; pageSize: number }) {
        commit(settingsMutations.SET_PAGE, { page, pageSize })
    },
    
    resetState({ commit }) {
        commit(settingsMutations.RESET_STATE)
    }
}
