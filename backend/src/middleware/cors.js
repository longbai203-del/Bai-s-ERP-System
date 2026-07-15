/**
 * @file cors.js
 * @description CORS 中间件
 * @module middleware/cors
 */

import { config } from '../config.js';

/**
 * CORS 中间件
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express 下一个中间件
 */
export const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    
    // 检查是否允许该来源
    if (config.corsOrigin === '*' || config.corsOrigin.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    // 预检请求直接返回
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
};

export default corsMiddleware;