/**
 * @file config.js
 * @description 应用配置
 */

require('dotenv').config();

const config = {
    // 服务器
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Supabase
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,

    // CORS
    corsOrigin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map(function(s) { return s.trim(); })
        : '*',

    // 日志
    logLevel: process.env.LOG_LEVEL || 'info'
};

/**
 * 验证必要配置
 */
function validateConfig() {
    var required = ['supabaseUrl', 'supabaseServiceKey', 'jwtSecret'];
    var missing = required.filter(function(key) { return !config[key]; });
    
    if (missing.length > 0) {
        console.warn('⚠️ 缺少必要配置: ' + missing.join(', '));
        if (config.nodeEnv === 'production') {
            throw new Error('缺少必要配置: ' + missing.join(', '));
        }
    }
}

validateConfig();

module.exports = config;
