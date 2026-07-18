/**
 * @file useApi.js
 * @description API 组合式函数 - 增强完整版
 * @module composables/useApi
 * 
 * @example
 * // 基本用法
 * const { data, loading, execute } = useApi()
 * await execute(() => api.get('/users'))
 * 
 * @example
 * // 资源CRUD
 * const { list, getList, create, update, remove } = useResource('users')
 * await getList({ page: 1, limit: 10 })
 * 
 * @example
 * // 缓存API
 * const { data, execute } = useCachedApi('users', fetchUsers, 60000)
 * await execute()
 * 
 * @example
 * // 批量请求
 * const { results, execute } = useBatchApi()
 * await execute([req1, req2, req3], { concurrency: 2 })
 */

import { ref, reactive, toRefs, computed, unref } from 'vue';
import apiClient from '../services/api-client.js';

// 使用Element Plus的提示组件（如果可用）
let ElMessage = null;
try {
    const { ElMessage: EM } = await import('element-plus');
    ElMessage = EM;
} catch (e) {
    // 如果Element Plus未安装，使用console
    ElMessage = {
        success: (msg) => console.log('✅', msg),
        error: (msg) => console.error('❌', msg),
        warning: (msg) => console.warn('⚠️', msg),
        info: (msg) => console.info('ℹ️', msg)
    };
}

// ============================================================
// 基础 API 组合函数
// ============================================================

/**
 * API 状态管理组合函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.autoReset - 是否自动重置状态
 * @returns {Object} API状态和方法
 */
export function useApi(options = {}) {
    const { autoReset = false } = options;
    
    const state = reactive({
        loading: false,
        error: null,
        data: null,
        success: false,
        statusCode: null,
        response: null
    });

    /**
     * 重置状态
     */
    const reset = () => {
        state.loading = false;
        state.error = null;
        state.data = null;
        state.success = false;
        state.statusCode = null;
        state.response = null;
    };

    /**
     * 执行API请求
     * @param {Function} requestFn - 请求函数
     * @param {Object} options - 请求选项
     * @param {boolean} options.showLoading - 是否显示加载状态
     * @param {boolean} options.showError - 是否显示错误提示
     * @param {string} options.errorMessage - 自定义错误消息
     * @param {boolean} options.throwError - 是否抛出错误
     * @returns {Promise<any>} 请求结果
     */
    const execute = async (requestFn, options = {}) => {
        const { 
            showLoading = true, 
            showError = true, 
            errorMessage = '请求失败',
            throwError = true
        } = options;
        
        if (autoReset) reset();
        
        state.loading = showLoading;
        state.success = false;
        state.error = null;

        try {
            const result = await requestFn();
            state.data = result.data || result;
            state.success = true;
            state.statusCode = result.status || 200;
            state.response = result;
            return result;
        } catch (error) {
            state.error = error;
            state.success = false;
            state.statusCode = error.status || 500;
            
            if (showError) {
                const message = error.message || errorMessage;
                ElMessage.error(message);
            }
            
            if (throwError) {
                throw error;
            }
            return error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 执行GET请求
     * @param {string} url - 请求URL
     * @param {Object} params - 查询参数
     * @param {Object} options - 请求选项
     * @returns {Promise<any>} 请求结果
     */
    const get = (url, params = {}, options = {}) => {
        return execute(() => apiClient.get(url, { params, ...options }), options);
    };

    /**
     * 执行POST请求
     * @param {string} url - 请求URL
     * @param {Object} data - 请求数据
     * @param {Object} options - 请求选项
     * @returns {Promise<any>} 请求结果
     */
    const post = (url, data = {}, options = {}) => {
        return execute(() => apiClient.post(url, data, options), options);
    };

    /**
     * 执行PUT请求
     */
    const put = (url, data = {}, options = {}) => {
        return execute(() => apiClient.put(url, data, options), options);
    };

    /**
     * 执行DELETE请求
     */
    const del = (url, options = {}) => {
        return execute(() => apiClient.delete(url, options), options);
    };

    /**
     * 执行PATCH请求
     */
    const patch = (url, data = {}, options = {}) => {
        return execute(() => apiClient.patch(url, data, options), options);
    };

    return {
        ...toRefs(state),
        reset,
        execute,
        get,
        post,
        put,
        del,
        patch
    };
}

// ============================================================
// 资源 CRUD 组合函数
// ============================================================

/**
 * 资源 CRUD 组合函数
 * @param {string} resource - 资源名称
 * @param {Object} options - 配置选项
 * @param {string} options.basePath - 基础路径
 * @param {Function} options.transformData - 数据转换函数
 * @param {Function} options.onSuccess - 成功回调
 * @param {Function} options.onError - 错误回调
 * @param {number} options.defaultPageSize - 默认每页数量
 * @returns {Object} CRUD方法和状态
 */
export function useResource(resource, options = {}) {
    const {
        basePath = `/${resource}`,
        transformData = (data) => data,
        onSuccess = null,
        onError = null,
        defaultPageSize = 10
    } = options;

    const state = reactive({
        list: [],
        item: null,
        loading: false,
        error: null,
        total: 0,
        page: 1,
        limit: defaultPageSize,
        filters: {},
        sort: { field: 'createdAt', order: 'desc' }
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
                sortField: state.sort.field,
                sortOrder: state.sort.order,
                ...state.filters,
                ...params
            };

            const response = await apiClient.get(basePath, { params: queryParams });
            
            if (response.ok) {
                const data = response.data;
                const list = data.data || data.list || data;
                state.list = transformData(Array.isArray(list) ? list : []);
                state.total = data.total || data.pagination?.total || data.count || 0;
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
                const data = response.data;
                state.item = transformData(data.data || data);
                if (onSuccess) onSuccess(data);
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
     * 设置排序
     */
    const setSort = (field, order = 'asc') => {
        state.sort = { field, order };
        state.page = 1;
        return getList();
    };

    /**
     * 刷新列表
     */
    const refresh = () => {
        return getList();
    };

    /**
     * 获取当前查询参数
     */
    const getQueryParams = () => {
        return {
            page: state.page,
            limit: state.limit,
            sortField: state.sort.field,
            sortOrder: state.sort.order,
            ...state.filters
        };
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
        setSort,
        refresh,
        getQueryParams
    };
}

// ============================================================
// 缓存 API 组合函数
// ============================================================

/**
 * 带缓存的 API 组合函数
 * @param {string} cacheKey - 缓存键名
 * @param {Function} fetchFn - 获取数据的函数
 * @param {number} ttl - 缓存过期时间(毫秒)
 * @returns {Object} 缓存API方法和状态
 */
export function useCachedApi(cacheKey, fetchFn, ttl = 60000) {
    const cache = new Map();
    const state = reactive({
        data: null,
        loading: false,
        error: null,
        fromCache: false,
        cacheTime: null,
        expired: false
    });

    const getCacheKey = (params = {}) => {
        return `${cacheKey}_${JSON.stringify(params)}`;
    };

    const isCacheValid = (key) => {
        const cached = cache.get(key);
        if (!cached) return false;
        const age = Date.now() - cached.timestamp;
        return age < ttl;
    };

    const getCacheAge = (key) => {
        const cached = cache.get(key);
        if (!cached) return null;
        return Date.now() - cached.timestamp;
    };

    /**
     * 执行请求
     * @param {Object} params - 请求参数
     * @param {boolean} forceRefresh - 是否强制刷新
     * @returns {Promise<any>} 数据
     */
    const execute = async (params = {}, forceRefresh = false) => {
        const key = getCacheKey(params);
        
        // 检查缓存
        if (!forceRefresh && isCacheValid(key)) {
            const cached = cache.get(key);
            state.data = cached.data;
            state.fromCache = true;
            state.loading = false;
            state.error = null;
            state.cacheTime = new Date(cached.timestamp);
            state.expired = false;
            return cached.data;
        }

        state.loading = true;
        state.error = null;
        state.fromCache = false;
        state.expired = false;

        try {
            const result = await fetchFn(params);
            state.data = result;
            state.cacheTime = new Date();
            
            // 更新缓存
            cache.set(key, {
                data: result,
                timestamp: Date.now()
            });
            
            return result;
        } catch (error) {
            state.error = error;
            state.expired = true;
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 清除缓存
     * @param {Object} params - 指定参数的缓存
     */
    const clearCache = (params = null) => {
        if (params) {
            const key = getCacheKey(params);
            cache.delete(key);
        } else {
            cache.clear();
        }
        state.fromCache = false;
        state.cacheTime = null;
        state.expired = false;
    };

    /**
     * 获取缓存统计
     */
    const getCacheStats = () => {
        const entries = [];
        for (const [key, value] of cache) {
            entries.push({
                key,
                age: Date.now() - value.timestamp,
                valid: isCacheValid(key)
            });
        }
        return {
            size: cache.size,
            entries,
            ttl
        };
    };

    return {
        ...toRefs(state),
        execute,
        clearCache,
        getCacheStats,
        isCacheValid,
        getCacheAge
    };
}

// ============================================================
// 批量请求组合函数
// ============================================================

/**
 * 批量请求组合函数
 * @param {Object} options - 配置选项
 * @param {number} options.defaultConcurrency - 默认并发数
 * @returns {Object} 批量请求方法和状态
 */
export function useBatchApi(options = {}) {
    const { defaultConcurrency = 3 } = options;
    
    const state = reactive({
        results: [],
        loading: false,
        error: null,
        progress: 0,
        total: 0,
        completed: 0,
        failed: 0,
        success: true
    });

    /**
     * 执行批量请求
     * @param {Array<Function>} requests - 请求函数数组
     * @param {Object} options - 配置选项
     * @param {number} options.concurrency - 并发数
     * @param {Function} options.onProgress - 进度回调
     * @param {Function} options.onItemComplete - 单项完成回调
     * @param {boolean} options.stopOnError - 遇到错误是否停止
     * @returns {Promise<Array>} 结果数组
     */
    const execute = async (requests, options = {}) => {
        const { 
            concurrency = defaultConcurrency,
            onProgress = null,
            onItemComplete = null,
            stopOnError = false
        } = options;
        
        state.loading = true;
        state.error = null;
        state.results = [];
        state.progress = 0;
        state.total = requests.length;
        state.completed = 0;
        state.failed = 0;
        state.success = true;

        try {
            // 分批
            const batches = [];
            for (let i = 0; i < requests.length; i += concurrency) {
                batches.push(requests.slice(i, i + concurrency));
            }

            for (const batch of batches) {
                const batchResults = await Promise.allSettled(
                    batch.map(async (req, index) => {
                        try {
                            const result = await req();
                            state.completed++;
                            if (onItemComplete) onItemComplete(result, index, true);
                            return { success: true, data: result, error: null, index };
                        } catch (error) {
                            state.completed++;
                            state.failed++;
                            state.success = false;
                            if (onItemComplete) onItemComplete(null, index, false, error);
                            if (stopOnError) throw error;
                            return { success: false, data: null, error, index };
                        }
                    })
                );
                
                state.results.push(...batchResults.map(r => 
                    r.status === 'fulfilled' ? r.value : { success: false, data: null, error: r.reason }
                ));
                state.progress = (state.completed / requests.length) * 100;
                
                if (onProgress) {
                    onProgress(state.progress, state.completed, requests.length);
                }
            }

            return state.results;
        } catch (error) {
            state.error = error;
            state.success = false;
            throw error;
        } finally {
            state.loading = false;
        }
    };

    /**
     * 重置状态
     */
    const reset = () => {
        state.results = [];
        state.loading = false;
        state.error = null;
        state.progress = 0;
        state.total = 0;
        state.completed = 0;
        state.failed = 0;
        state.success = true;
    };

    /**
     * 获取成功的结果
     */
    const getSuccessResults = () => {
        return state.results.filter(r => r.success);
    };

    /**
     * 获取失败的结果
     */
    const getFailedResults = () => {
        return state.results.filter(r => !r.success);
    };

    return {
        ...toRefs(state),
        execute,
        reset,
        getSuccessResults,
        getFailedResults
    };
}

// ============================================================
// 默认导出
// ============================================================

export default {
    useApi,
    useResource,
    useCachedApi,
    useBatchApi
};