import { GetterTree } from 'vuex'
import { ProductsState } from './types'

export const getters: GetterTree<ProductsState, any> = {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    errorMessage: (state) => state.error,
    getData: (state) => state.data,
    getTotal: (state) => state.total,
    getCurrentPage: (state) => state.currentPage,
    getPageSize: (state) => state.pageSize,
    getDataCount: (state) => state.data.length
}
