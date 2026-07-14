/**
 * frontend/js/core/api-client.js - API 客户端
 * 统一处理所有 API 请求
 * 
 * @module api-client
 * @example
 * import apiClient from '/js/core/api-client.js';
 * const user = await apiClient.get('/auth/me');
 * const order = await apiClient.post('/orders', { customerId: 'xxx' });
 */

const API_BASE = window.APP_CONFIG?.apiBaseUrl || '/api';

/**
 * 获取认证 Token
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

/**
 * 设置认证 Token
 * @param {string} token
 * @param {boolean} remember - 是否记住登录
 */
export function setToken(token, remember = false) {
    if (remember) {
        localStorage.setItem('auth_token', token);
    } else {
        sessionStorage.setItem('auth_token', token);
    }
}

/**
 * 清除认证 Token
 */
export function clearToken() {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
}

/**
 * 检查是否已登录
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * API 客户端对象
 */
export const apiClient = {
    /**
     * 发起 API 请求
     * @param {string} endpoint - API 端点 (如 '/auth/login')
     * @param {Object} options - fetch 选项
     * @param {Object} options.params - URL 查询参数
     * @param {Object} options.headers - 自定义请求头
     * @param {*} options.body - 请求体 (会自动 JSON 序列化)
     * @param {string} options.method - HTTP 方法
     * @returns {Promise<any>}
     */
    async request(endpoint, options = {}) {
        const { params, headers = {}, body, ...restOptions } = options;
        
        // 构建 URL
        let url = `${API_BASE}${endpoint}`;
        
        // 添加查询参数
        if (params) {
            const searchParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    searchParams.append(key, params[key]);
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }
        
        // 构建请求头
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        };
        
        // 添加认证 Token
        const token = getToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        // 构建请求配置
        const requestOptions = {
            ...restOptions,
            headers: requestHeaders
        };
        
        // 处理请求体
        if (body) {
            requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        
        try {
            const response = await fetch(url, requestOptions);
            
            // 检查是否需要刷新 Token（401 未授权）
            if (response.status === 401) {
                const data = await response.json().catch(() => ({}));
                if (data.code === 'INVALID_TOKEN' || data.code === 'TOKEN_EXPIRED') {
                    clearToken();
                    // 可以触发登录跳转事件
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                }
            }
            
            // 解析响应
            const contentType = response.headers.get('content-type') || '';
            let data;
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            // 检查响应状态
            if (!response.ok) {
                const error = new Error(data?.message || data?.error || `HTTP ${response.status}`);
                error.status = response.status;
                error.code = data?.code;
                error.data = data;
                throw error;
            }
            
            return data;
            
        } catch (error) {
            // 网络错误处理
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                const networkError = new Error('网络连接失败，请检查网络');
                networkError.code = 'NETWORK_ERROR';
                throw networkError;
            }
            throw error;
        }
    },
    
    /**
     * GET 请求
     * @param {string} endpoint
     * @param {Object} params - URL 查询参数
     * @param {Object} options - 额外选项
     * @returns {Promise<any>}
     */
    get(endpoint, params = {}, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET', params });
    },
    
    /**
     * POST 请求
     * @param {string} endpoint
     * @param {*} body - 请求体
     * @param {Object} options - 额外选项
     * @returns {Promise<any>}
     */
    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    },
    
    /**
     * PUT 请求
     * @param {string} endpoint
     * @param {*} body - 请求体
     * @param {Object} options - 额外选项
     * @returns {Promise<any>}
     */
    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    },
    
    /**
     * PATCH 请求
     * @param {string} endpoint
     * @param {*} body - 请求体
     * @param {Object} options - 额外选项
     * @returns {Promise<any>}
     */
    patch(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    },
    
    /**
     * DELETE 请求
     * @param {string} endpoint
     * @param {Object} params - URL 查询参数
     * @param {Object} options - 额外选项
     * @returns {Promise<any>}
     */
    delete(endpoint, params = {}, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE', params });
    },
    
    /**
     * 文件上传
     * @param {string} endpoint
     * @param {FormData} formData
     * @param {Function} onProgress - 上传进度回调
     * @returns {Promise<any>}
     */
    async upload(endpoint, formData, onProgress = null) {
        const token = getToken();
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.open('POST', `${API_BASE}${endpoint}`);
            
            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });
            
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        onProgress(Math.round((e.loaded / e.total) * 100));
                    }
                });
            }
            
            xhr.onload = () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(data?.message || `Upload failed: ${xhr.status}`));
                    }
                } catch (e) {
                    reject(new Error('解析响应失败'));
                }
            };
            
            xhr.onerror = () => {
                reject(new Error('上传失败，请检查网络'));
            };
            
            xhr.send(formData);
        });
    }
};

/**
 * 创建带默认配置的 API 客户端实例
 * @param {Object} defaultOptions - 默认选项
 * @returns {Object}
 */
export function createApiClient(defaultOptions = {}) {
    return {
        request(endpoint, options = {}) {
            return apiClient.request(endpoint, { ...defaultOptions, ...options });
        },
        get(endpoint, params = {}, options = {}) {
            return apiClient.get(endpoint, params, { ...defaultOptions, ...options });
        },
        post(endpoint, body, options = {}) {
            return apiClient.post(endpoint, body, { ...defaultOptions, ...options });
        },
        put(endpoint, body, options = {}) {
            return apiClient.put(endpoint, body, { ...defaultOptions, ...options });
        },
        patch(endpoint, body, options = {}) {
            return apiClient.patch(endpoint, body, { ...defaultOptions, ...options });
        },
        delete(endpoint, params = {}, options = {}) {
            return apiClient.delete(endpoint, params, { ...defaultOptions, ...options });
        },
        upload(endpoint, formData, onProgress = null) {
            return apiClient.upload(endpoint, formData, onProgress);
        }
    };
}

export default apiClient;