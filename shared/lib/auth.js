/**
 * shared/lib/auth.js - JWT 验证中间件
 */

import { getUserFromRequest } from './supabase.js';

/**
 * 验证 JWT 中间件
 * 用法: export default authMiddleware(handler)
 */
export function authMiddleware(handler) {
    return async function(req, res) {
        try {
            const user = await getUserFromRequest(req);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: '未授权，请先登录',
                    code: 'UNAUTHORIZED'
                });
            }
            
            req.user = user;
            return handler(req, res);
        } catch (error) {
            console.error('[Auth] 验证失败:', error);
            return res.status(401).json({
                success: false,
                error: '认证失败',
                code: 'AUTH_FAILED'
            });
        }
    };
}

/**
 * 可选认证（不强制登录）
 */
export function optionalAuthMiddleware(handler) {
    return async function(req, res) {
        try {
            const user = await getUserFromRequest(req);
            req.user = user;
            return handler(req, res);
        } catch (error) {
            req.user = null;
            return handler(req, res);
        }
    };
}

/**
 * 角色验证中间件
 * 用法: export default roleMiddleware(['owner', 'admin'])(handler)
 */
export function roleMiddleware(allowedRoles) {
    return function(handler) {
        return async function(req, res) {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: '未授权',
                    code: 'UNAUTHORIZED'
                });
            }
            
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    error: '权限不足，需要角色: ' + allowedRoles.join(', '),
                    code: 'FORBIDDEN'
                });
            }
            
            return handler(req, res);
        };
    };
}

// ✅ 添加 authenticate 别名（兼容性）
export const authenticate = authMiddleware;

// ✅ 添加 requireRole 别名（兼容性）
export const requireRole = roleMiddleware;

/**
 * 获取当前用户（用于权限模块）
 */
export function getCurrentUser(req, res, next) {
    return authMiddleware((req, res) => {
        if (req.user) {
            return res.json({
                success: true,
                data: req.user
            });
        }
        return res.status(401).json({
            success: false,
            error: '未认证'
        });
    })(req, res);
}

console.log('[Auth] ✅ 认证中间件已加载');