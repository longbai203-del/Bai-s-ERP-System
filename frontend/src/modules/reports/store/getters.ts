import { GetterTree } from 'vuex'
import { reportsState } from './types'

export const getters: GetterTree<reportsState, any> = {
    isLoading: (state): boolean => state.loading,
    hasError: (state): boolean => state.error !== null,
    errorMessage: (state): string | null => state.error,
    getData: (state): any[] | null => state.data,
    getCurrentItem: (state): any | null => state.currentItem,
    getTotal: (state): number => state.total,
    getCurrentPage: (state): number => state.currentPage,
    getPageSize: (state): number => state.pageSize,
    getDataCount: (state): number => state.data?.length || 0
}
