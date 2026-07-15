/**
 * @file config.js
 * @description 前端统一配置
 * @module core/config
 */

export const config = {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    appName: import.meta.env.VITE_APP_NAME || 'Bai\'s ERP',
    version: import.meta.env.VITE_APP_VERSION || '3.0.0',
    debug: import.meta.env.DEV || false,
    timeout: 30000,
    retryCount: 3,
    pagination: {
        defaultPageSize: 20,
        pageSizeOptions: [10, 20, 50, 100]
    }
};

export const getEnvironment = () => config.debug ? 'development' : 'production';
export const isDevelopment = () => config.debug;

export default config;