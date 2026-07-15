/**
 * @file error-handler.js
 * @description 错误处理中间件
 * @module middleware/error-handler
 */

import { logger } from '../utils/logger.js';
import { response } from '../utils/response.js';
import { config } from '../config.js';

/**
 * 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express 下一个中间件
 */
export const errorHandler = (err, req, res, next) => {
    logger.error('[ErrorHandler]', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    
    // 数据库错误
    if (err.code && err.code.startsWith('P')) {
        return response.error(res, '数据库操作失败', 500, 'DATABASE_ERROR');
    }
    
    // JWT 错误
    if (err.name === 'JsonWebTokenError') {
        return response.error(res, '无效的认证令牌', 401, 'INVALID_TOKEN');
    }
    if (err.name === 'TokenExpiredError') {
        return response.error(res, '认证令牌已过期', 401, 'TOKEN_EXPIRED');
    }
    
    // 验证错误
    if (err.name === 'ValidationError') {
        return response.error(res, err.message, 400, 'VALIDATION_ERROR');
    }
    
    // 默认错误
    const statusCode = err.statusCode || 500;
    const message = config.nodeEnv === 'production' 
        ? '服务器内部错误' 
        : err.message || '服务器内部错误';
    
    return response.error(res, message, statusCode, err.code || 'INTERNAL_ERROR');
};

export default errorHandler;