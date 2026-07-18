/**
 * @file auth.js
 * @description 认证中间件
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');

/**
 * JWT 认证中间件
 */
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: '无效的认证令牌'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: '认证令牌已过期'
            });
        }
        next(error);
    }
}

/**
 * 角色授权中间件
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: '未认证'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: '权限不足'
            });
        }

        next();
    };
}

/**
 * 权限检查中间件
 */
function hasPermission(permission) {
    return async (req, res, next) => {
        try {
            // 实际项目中检查用户权限
            // const permissions = await getUserPermissions(req.user.id);
            // if (!permissions.includes(permission)) { ... }
            
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    authenticate,
    authorize,
    hasPermission
};
