import { Module } from 'vuex'
import { dashboardState } from './types'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const dashboardStore: Module<dashboardState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export * from './types'
export { state } from './state'
export { mutations } from './mutations'
export { actions } from './actions'
export { getters } from './getters'

// 导出 useDashboardStore (用于 Composition API)
export const useDashboardStore = () => {
    // 这里返回一个包含 store 方法的对象
    return {
        state,
        ...actions,
        ...getters
    }
}
