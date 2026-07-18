/**
 * @file api-client.js
 * @description 统一 HTTP 请求客户端 - 增强完整版
 * @module services/api-client
 */

import { config } from '@core/config.js';

// 请求配置
const DEFAULT_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * HTTP 请求客户端类
 */
class ApiClient {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.interceptors = {
            request: [],
            response: [],
            error: []
        };
    }

    /**
     * 添加请求拦截器
     */
    addRequestInterceptor(interceptor) {
        this.interceptors.request.push(interceptor);
    }

    /**
     * 添加响应拦截器
     */
    addResponseInterceptor(interceptor) {
        this.interceptors.response.push(interceptor);
    }

    /**
     * 添加错误拦截器
     */
    addErrorInterceptor(interceptor) {
        this.interceptors.error.push(interceptor);
    }

    /**
     * 执行请求拦截器链
     */
    async applyRequestInterceptors(options) {
        let result = options;
        for (const interceptor of this.interceptors.request) {
            result = await interceptor(result);
        }
        return result;
    }

    /**
     * 执行响应拦截器链
     */
    async applyResponseInterceptors(response) {
        let result = response;
        for (const interceptor of this.interceptors.response) {
            result = await interceptor(result);
        }
        return result;
    }

    /**
     * 执行错误拦截器链
     */
    async applyErrorInterceptors(error) {
        let result = error;
        for (const interceptor of this.interceptors.error) {
            result = await interceptor(result);
        }
        throw result;
    }

    /**
     * 构建请求URL
     */
    buildUrl(url, params = {}) {
        const baseUrl = this.config.baseURL;
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        
        if (Object.keys(params).length === 0) {
            return fullUrl;
        }

        const urlObj = new URL(fullUrl);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                urlObj.searchParams.append(key, params[key]);
            }
        });
        return urlObj.toString();
    }

    /**
     * 发送请求
     */
    async request(url, options = {}) {
        const {
            method = 'GET',
            params = {},
            body = null,
            headers = {},
            timeout = this.config.timeout
        } = options;

        // 构建请求配置
        let requestOptions = {
            method,
            headers: {
                ...this.config.headers,
                ...headers
            },
            timeout,
            credentials: 'include'
        };

        // 添加请求体
        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
            requestOptions.headers['Content-Type'] = 'application/json';
        }

        // 应用请求拦截器
        requestOptions = await this.applyRequestInterceptors(requestOptions);

        // 构建完整URL
        const fullUrl = this.buildUrl(url, params);

        try {
            // 发送请求
            const response = await fetch(fullUrl, requestOptions);
            
            // 解析响应
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else if (contentType?.includes('text/')) {
                data = await response.text();
            } else {
                data = await response.blob();
            }

            // 构建响应对象
            const responseObj = {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: { url, ...options },
                ok: response.ok
            };

            // 应用响应拦截器
            return await this.applyResponseInterceptors(responseObj);
        } catch (error) {
            // 错误处理
            const errorObj = {
                error,
                config: { url, ...options },
                status: error.status || 500,
                message: error.message || '请求失败'
            };

            return await this.applyErrorInterceptors(errorObj);
        }
    }

    /**
     * GET 请求
     */
    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    /**
     * POST 请求
     */
    post(url, body, options = {}) {
        return this.request(url, { ...options, method: 'POST', body });
    }

    /**
     * PUT 请求
     */
    put(url, body, options = {}) {
        return this.request(url, { ...options, method: 'PUT', body });
    }

    /**
     * DELETE 请求
     */
    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }

    /**
     * PATCH 请求
     */
    patch(url, body, options = {}) {
        return this.request(url, { ...options, method: 'PATCH', body });
    }

    /**
     * 文件上传
     */
    upload(url, file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.request(url, {
            ...options,
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    /**
     * 下载文件
     */
    download(url, filename, options = {}) {
        return this.request(url, {
            ...options,
            method: 'GET',
            responseType: 'blob'
        }).then(response => {
            const blob = response.data;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            return response;
        });
    }
}

// 创建默认实例
const apiClient = new ApiClient();

// 默认拦截器 - 添加认证令牌
apiClient.addRequestInterceptor((config) => {
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('token');
    
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求ID用于追踪
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Request-ID'] = requestId;
    
    return config;
});

// 默认拦截器 - 响应处理
apiClient.addResponseInterceptor((response) => {
    if (response.status === 401) {
        // 令牌过期，清除本地存储
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 跳转到登录页
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    return response;
});

// 默认拦截器 - 错误处理
apiClient.addErrorInterceptor((error) => {
    console.error('[API Error]', {
        url: error.config?.url,
        status: error.status,
        message: error.message
    });
    return error;
});

export { ApiClient, apiClient };
export default apiClient;
