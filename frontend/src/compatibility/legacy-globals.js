/**
 * @file legacy-globals.js
 * @description 旧版全局对象兼容层
 * @module compatibility/legacy-globals
 * 
 * 用于兼容旧代码中的 window.AppConfig, window.AppAuth, window.AppApi 等
 * 仅用于迁移过渡期，新代码应使用标准导入
 */

import { config } from '@core/config.js';
import { apiClient } from '@services/api-client.js';
import { auth } from '@core/auth.js';

/**
 * 旧版配置对象
 */
const legacyConfig = {
    supabase: {
        url: import.meta.env?.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
    },
    api: {
        baseUrl: config.apiBaseUrl
    },
    app: {
        name: config.appName,
        version: config.version,
        debug: config.debug
    },
    defaults: {
        vatRate: 15,
        shopName: 'Car Wash Pro'
    },
    modules: {
        dashboard: { label: '仪表板', icon: 'fa-chart-line' },
        orders: { label: '订单管理', icon: 'fa-clipboard-list' },
        products: { label: '商品管理', icon: 'fa-box' },
        customers: { label: '客户管理', icon: 'fa-users' },
        inventory: { label: '库存管理', icon: 'fa-warehouse' }
    },
    permissions: {
        owner: ['dashboard', 'orders', 'products', 'customers', 'inventory', 'settings'],
        admin: ['dashboard', 'orders', 'products', 'customers', 'inventory', 'settings'],
        manager: ['dashboard', 'orders', 'customers'],
        cashier: ['dashboard', 'orders', 'customers'],
        employee: ['dashboard']
    }
};

/**
 * 旧版认证对象
 */
const legacyAuth = {
    showLogin: () => {
        console.warn('[Legacy] AppAuth.showLogin 已弃用，请使用新的 auth 模块');
    },
    showRegister: () => {
        console.warn('[Legacy] AppAuth.showRegister 已弃用，请使用新的 auth 模块');
    },
    login: async (username, password) => {
        console.warn('[Legacy] AppAuth.login 已弃用，请使用 auth.login');
        return auth.login(username, password);
    },
    logout: () => {
        console.warn('[Legacy] AppAuth.logout 已弃用，请使用 auth.logout');
        return auth.logout();
    },
    register: async (data) => {
        console.warn('[Legacy] AppAuth.register 已弃用，请使用 auth.register');
        return auth.register(data);
    }
};

/**
 * 旧版 API 对象 - 适配新 api-client
 */
const legacyApi = {
    query: async (table, options = {}) => {
        console.warn('[Legacy] AppApi.query 已弃用，请使用新的 service 层');
        try {
            const response = await apiClient.get(`/v1/${table}`, { params: options });
            return response.data || [];
        } catch (error) {
            console.error('[Legacy] AppApi.query 失败:', error);
            return [];
        }
    },
    insert: async (table, data) => {
        console.warn('[Legacy] AppApi.insert 已弃用，请使用新的 service 层');
        try {
            const response = await apiClient.post(`/v1/${table}`, data);
            return response.data || [];
        } catch (error) {
            console.error('[Legacy] AppApi.insert 失败:', error);
            return [];
        }
    },
    update: async (table, id, data) => {
        console.warn('[Legacy] AppApi.update 已弃用，请使用新的 service 层');
        try {
            const response = await apiClient.put(`/v1/${table}/${id}`, data);
            return response.data || [];
        } catch (error) {
            console.error('[Legacy] AppApi.update 失败:', error);
            return [];
        }
    },
    delete: async (table, id) => {
        console.warn('[Legacy] AppApi.delete 已弃用，请使用新的 service 层');
        try {
            await apiClient.delete(`/v1/${table}/${id}`);
            return true;
        } catch (error) {
            console.error('[Legacy] AppApi.delete 失败:', error);
            return false;
        }
    },
    // 兼容旧版快捷方法
    getOrders: () => legacyApi.query('orders'),
    getProducts: () => legacyApi.query('products'),
    getCustomers: () => legacyApi.query('customers'),
    getInventory: () => legacyApi.query('inventory'),
    getAttendance: () => legacyApi.query('attendance')
};

/**
 * 挂载到全局对象（仅用于兼容旧代码）
 */
export const mountLegacyGlobals = () => {
    if (typeof window !== 'undefined') {
        window.AppConfig = legacyConfig;
        window.AppAuth = legacyAuth;
        window.AppApi = legacyApi;
        window.AppStore = {
            get: (key) => {
                try {
                    const data = localStorage.getItem(`app_store_${key}`);
                    return data ? JSON.parse(data) : null;
                } catch {
                    return null;
                }
            },
            set: (key, value) => {
                try {
                    localStorage.setItem(`app_store_${key}`, JSON.stringify(value));
                } catch (e) {
                    console.warn('[Legacy] AppStore.set 失败:', e);
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(`app_store_${key}`);
                } catch (e) {
                    console.warn('[Legacy] AppStore.remove 失败:', e);
                }
            }
        };
        window.AppUtils = {
            toast: (message, type = 'info') => {
                console.warn('[Legacy] AppUtils.toast 已弃用');
                // 简单实现
                const colors = {
                    success: '#10B981',
                    error: '#EF4444',
                    warning: '#F59E0B',
                    info: '#3B82F6'
                };
                console.log(`%c[${type.toUpperCase()}] ${message}`, `color: ${colors[type] || '#6B7280'}`);
            },
            formatCurrency: (amount) => {
                return Number(amount || 0).toFixed(2);
            },
            formatDate: (date) => {
                if (!date) return '-';
                const d = new Date(date);
                return d.toLocaleDateString('zh-CN');
            }
        };
        console.log('✅ [Legacy] 全局兼容对象已挂载');
    }
};

export { legacyConfig as AppConfig, legacyAuth as AppAuth, legacyApi as AppApi };
export default { mountLegacyGlobals, AppConfig: legacyConfig, AppAuth: legacyAuth, AppApi: legacyApi };