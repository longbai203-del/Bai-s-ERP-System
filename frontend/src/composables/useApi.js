/**
 * @file useApi.js
 * @description API 组合式函数 - 增强完整版
 * @module composables/useApi
 */

import { ref, reactive, toRefs, computed } from 'vue';
import apiClient from '../services/api-client.js';
import { ElMessage } from 'element-plus';

/**
 * API 状态管理组合函数
 */
export function useApi() {
    const state = reactive({
        loading: false,
        error: null,
        data: null,
        success: false
    });

    const reset = () => {
        state.loading = false;
        state.error = null;
        state.data = null;
        state.success = false;
    };

    const execute = async (requestFn, options = {}) => {
        const { showLoading = true, showError = true, errorMessage = '请求失败' } = options;
        
        reset();
        if (showLoading) state.loading = true;
        state.success = false;

        try {
            const result = await requestFn();
            state.data = result;
            state.success = true;
            return result;
        } catch (error) {
            state.error = error;
            state.success = false;
            
            if (showError) {
                const message = error.message || errorMessage;
                ElMessage.error(message);
            }
            
            throw error;
        } finally {
            if (showLoading) state.loading = false;
        }
    };

    return {
        ...toRefs(state),
        reset,
        execute
    };
}

/**
 * 资源 CRUD 组合函数
 * @param {string} resource - 资源名称
 * @param {Object} options - 配置选项
 */
export function useResource(resource, options = {}) {
    const {
        basePath = `/${resource}`,
        transformData = (data) => data,
        onSuccess = null,
        onError = null
    } = options;

    const state = reactive({
        list: [],
        item: null,
        loading: false,
        error: null,
        total: 0,
        page: 1,
        limit: 10,
        filters: {}
    });

    /**
     * 获取列表
     */
    const getList = async (params = {}) => {
        state.loading = true;
        state.error = null;

        try {
            const queryParams = {
                page: state.page,
                limit: state.limit,
                ...state.filters,
                ...params
            };

            const response = await apiClient.get(basePath, { params: queryParams });
            
            if (response.ok) {
                const data = response.data;
                state.list = transformData(data.data || data) || [];
                state.total = data.pagination?.total || data.total || 0;
                if (onSuccess) onSuccess(data);
                return data;
            } else {
                throw new Error(response.message || '获取列表失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '获取列表失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 获取单条记录
     */
    const getItem = async (id) => {
        state.loading = true;
        state.error = null;

        try {
            const response = await apiClient.get(`${basePath}/${id}`);
            
            if (response.ok) {
                state.item = transformData(response.data.data || response.data);
                if (onSuccess) onSuccess(response.data);
                return state.item;
            } else {
                throw new Error(response.message || '获取记录失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '获取记录失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 创建记录
     */
    const create = async (data) => {
        state.loading = true;
        state.error = null;

        try {
            const response = await apiClient.post(basePath, data);
            
            if (response.ok) {
                const result = response.data.data || response.data;
                if (onSuccess) onSuccess(result);
                ElMessage.success('创建成功');
                return result;
            } else {
                throw new Error(response.message || '创建失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '创建失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 更新记录
     */
    const update = async (id, data) => {
        state.loading = true;
        state.error = null;

        try {
            const response = await apiClient.put(`${basePath}/${id}`, data);
            
            if (response.ok) {
                const result = response.data.data || response.data;
                if (onSuccess) onSuccess(result);
                ElMessage.success('更新成功');
                return result;
            } else {
                throw new Error(response.message || '更新失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '更新失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 删除记录
     */
    const remove = async (id) => {
        state.loading = true;
        state.error = null;

        try {
            const response = await apiClient.delete(`${basePath}/${id}`);
            
            if (response.ok) {
                if (onSuccess) onSuccess(response.data);
                ElMessage.success('删除成功');
                return true;
            } else {
                throw new Error(response.message || '删除失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '删除失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 搜索
     */
    const search = async (keyword, params = {}) => {
        state.loading = true;
        state.error = null;

        try {
            const response = await apiClient.get(`${basePath}/search`, {
                params: { q: keyword, ...params }
            });
            
            if (response.ok) {
                const data = response.data.data || response.data;
                if (onSuccess) onSuccess(data);
                return data;
            } else {
                throw new Error(response.message || '搜索失败');
            }
        } catch (error) {
            state.error = error;
            if (onError) onError(error);
            ElMessage.error(error.message || '搜索失败');
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 设置分页
     */
    const setPage = (page) => {
        state.page = page;
        return getList();
    };

    /**
     * 设置每页数量
     */
    const setLimit = (limit) => {
        state.limit = limit;
        state.page = 1;
        return getList();
    };

    /**
     * 设置筛选条件
     */
    const setFilters = (filters) => {
        state.filters = { ...state.filters, ...filters };
        state.page = 1;
        return getList();
    };

    /**
     * 重置筛选
     */
    const resetFilters = () => {
        state.filters = {};
        state.page = 1;
        return getList();
    };

    /**
     * 刷新列表
     */
    const refresh = () => {
        return getList();
    };

    return {
        ...toRefs(state),
        getList,
        getItem,
        create,
        update,
        remove,
        search,
        setPage,
        setLimit,
        setFilters,
        resetFilters,
        refresh
    };
}

/**
 * 带缓存的 API 组合函数
 */
export function useCachedApi(cacheKey, fetchFn, ttl = 60000) {
    const cache = new Map();
    const state = reactive({
        data: null,
        loading: false,
        error: null,
        fromCache: false
    });

    const getCacheKey = (params = {}) => {
        return `${cacheKey}_${JSON.stringify(params)}`;
    };

    const isCacheValid = (key) => {
        const cached = cache.get(key);
        if (!cached) return false;
        return Date.now() - cached.timestamp < ttl;
    };

    const execute = async (params = {}, forceRefresh = false) => {
        const key = getCacheKey(params);
        
        // 检查缓存
        if (!forceRefresh && isCacheValid(key)) {
            const cached = cache.get(key);
            state.data = cached.data;
            state.fromCache = true;
            state.loading = false;
            state.error = null;
            return cached.data;
        }

        state.loading = true;
        state.error = null;
        state.fromCache = false;

        try {
            const result = await fetchFn(params);
            state.data = result;
            state.fromCache = false;
            
            // 更新缓存
            cache.set(key, {
                data: result,
                timestamp: Date.now()
            });
            
            return result;
        } catch (error) {
            state.error = error;
            throw error;
        } finally {
            state.loading = false;
        }
    };

    const clearCache = (params = null) => {
        if (params) {
            const key = getCacheKey(params);
            cache.delete(key);
        } else {
            cache.clear();
        }
    };

    return {
        ...toRefs(state),
        execute,
        clearCache
    };
}

/**
 * 批量请求组合函数
 */
export function useBatchApi() {
    const state = reactive({
        results: [],
        loading: false,
        error: null,
        progress: 0
    });

    const execute = async (requests, options = {}) => {
        const { concurrency = 3, onProgress = null } = options;
        
        state.loading = true;
        state.error = null;
        state.results = [];
        state.progress = 0;

        try {
            const batches = [];
            for (let i = 0; i < requests.length; i += concurrency) {
                batches.push(requests.slice(i, i + concurrency));
            }

            for (const batch of batches) {
                const batchResults = await Promise.all(
                    batch.map(async (req) => {
                        try {
                            const result = await req();
                            return { success: true, data: result, error: null };
                        } catch (error) {
                            return { success: false, data: null, error };
                        }
                    })
                );
                
                state.results.push(...batchResults);
                state.progress = (state.results.length / requests.length) * 100;
                
                if (onProgress) {
                    onProgress(state.progress);
                }
            }

            return state.results;
        } catch (error) {
            state.error = error;
            throw error;
        } finally {
            state.loading = false;
        }
    };

    return {
        ...toRefs(state),
        execute
    };
}

export default {
    useApi,
    useResource,
    useCachedApi,
    useBatchApi
};
