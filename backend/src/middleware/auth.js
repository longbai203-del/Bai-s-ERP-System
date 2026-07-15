/**
 * @file auth.js
 * @description 认证中间件
 * @module middleware/auth
 */

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { supabaseService } from '../services/supabase.service.js';
import { response } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * JWT 认证中间件
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express 下一个中间件
 */
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.error(res, '未提供认证令牌', 401, 'UNAUTHORIZED');
        }
        
        const token = authHeader.substring(7);
        
        // 验证 JWT
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return response.error(res, '认证令牌已过期', 401, 'TOKEN_EXPIRED');
            }
            return response.error(res, '无效的认证令牌', 401, 'INVALID_TOKEN');
        }
        
        // 获取用户信息
        const userResult = await supabaseService.getUserById(decoded.userId);
        if (!userResult.success || !userResult.data) {
            return response.error(res, '用户不存在', 401, 'USER_NOT_FOUND');
        }
        
        req.user = userResult.data;
        req.userId = userResult.data.id;
        
        next();
    } catch (error) {
        logger.error('[Auth] 认证失败:', error);
        return response.error(res, '认证失败', 500, 'AUTH_ERROR');
    }
};

/**
 * 可选认证中间件（不强制登录）
 */
export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, config.jwtSecret);
                const userResult = await supabaseService.getUserById(decoded.userId);
                if (userResult.success && userResult.data) {
                    req.user = userResult.data;
                    req.userId = userResult.data.id;
                }
            } catch (e) {
                // 忽略 token 错误
            }
        }
        
        next();
    } catch (error) {
        next();
    }
};

/**
 * 角色验证中间件
 * @param {string|string[]} roles - 允许的角色
 * @returns {Function} 中间件函数
 */
export const roleMiddleware = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return async (req, res, next) => {
        if (!req.user) {
            return response.error(res, '未认证', 401, 'UNAUTHORIZED');
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return response.error(res, '权限不足', 403, 'FORBIDDEN');
        }
        
        next();
    };
};

/**
 * 权限验证中间件
 * @param {string|string[]} permissions - 需要的权限
 * @returns {Function} 中间件函数
 */
export const permissionMiddleware = (permissions) => {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    
    return async (req, res, next) => {
        if (!req.user) {
            return response.error(res, '未认证', 401, 'UNAUTHORIZED');
        }
        
        // owner 和 admin 拥有所有权限
        if (req.user.role === 'owner' || req.user.role === 'admin') {
            return next();
        }
        
        // 检查用户权限
        const userPermissions = req.user.permissions || [];
        const hasAll = requiredPermissions.every(p => userPermissions.includes(p));
        
        if (!hasAll) {
            return response.error(res, '缺少必要权限', 403, 'FORBIDDEN');
        }
        
        next();
    };
};

export default {
    authMiddleware,
    optionalAuthMiddleware,
    roleMiddleware,
    permissionMiddleware
};