/**
 * @file config.js
 * @description 后端配置
 * @module config
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * 配置对象
 * @typedef {Object} Config
 * @property {number} port - 服务端口
 * @property {string} nodeEnv - 运行环境
 * @property {string} appName - 应用名称
 * @property {string} version - 版本号
 * @property {string} supabaseUrl - Supabase URL
 * @property {string} supabaseServiceKey - Supabase 服务密钥
 * @property {string} supabaseAnonKey - Supabase 匿名密钥
 * @property {string} jwtSecret - JWT 密钥
 * @property {string} jwtExpiresIn - JWT 过期时间
 * @property {string|string[]} corsOrigin - CORS 允许来源
 * @property {string} logLevel - 日志级别
 */

/** @type {Config} */
export const config = {
    // 服务器
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // 应用
    appName: process.env.APP_NAME || 'Bai\'s ERP',
    version: process.env.APP_VERSION || '2.0.0',
    
    // Supabase
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // CORS
    corsOrigin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
        : '*',
    
    // 日志
    logLevel: process.env.LOG_LEVEL || 'info'
};

/**
 * 验证必要配置
 */
export const validateConfig = () => {
    const required = ['supabaseUrl', 'supabaseServiceKey', 'jwtSecret'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.warn(`⚠️ 缺少必要配置: ${missing.join(', ')}`);
        if (config.nodeEnv === 'production') {
            throw new Error(`缺少必要配置: ${missing.join(', ')}`);
        }
    }
};

validateConfig();

export default config;