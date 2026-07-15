/**
 * @file config.js
 * @description 前端独立配置
 * @module config
 */

/**
 * 环境配置对象
 * @typedef {Object} Config
 * @property {string} apiBaseUrl - API 基础地址
 * @property {string} appName - 应用名称
 * @property {string} version - 版本号
 * @property {boolean} debug - 调试模式
 */

/** @type {Config} */
export const config = {
    apiBaseUrl: window.APP_ENV?.API_BASE_URL || '/api',
    appName: window.APP_ENV?.APP_NAME || 'Bai\'s ERP',
    version: window.APP_ENV?.VERSION || '2.0.0',
    debug: window.location.hostname === 'localhost',
    timeout: 30000,
    retryCount: 3
};

/**
 * 获取当前环境
 * @returns {'development' | 'production'}
 */
export const getEnvironment = () => {
    return config.debug ? 'development' : 'production';
};

/**
 * 判断是否为开发环境
 * @returns {boolean}
 */
export const isDevelopment = () => config.debug;

export default config;