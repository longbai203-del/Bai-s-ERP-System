/**
 * 认证和授权中间件
 */
const jwt = require('jsonwebtoken');
const repositories = require('../repositories');

/**
 * JWT认证中间件
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: '未提供认证令牌'
            });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // 验证用户是否存在
        const user = await repositories.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: '用户不存在'
            });
        }

        if (user.status === 'inactive') {
            return res.status(401).json({
                code: 401,
                success: false,
                message: '账户已被禁用'
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                success: false,
                message: '无效的认证令牌'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                code: 401,
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
                code: 401,
                success: false,
                message: '未认证'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: '权限不足'
            });
        }

        next();
    };
}

/**
 * 权限检查中间件（细粒度）
 */
function hasPermission(permission) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    code: 401,
                    success: false,
                    message: '未认证'
                });
            }

            const permissions = await repositories.User.getUserPermissions(userId);
            if (!permissions.includes(permission)) {
                return res.status(403).json({
                    code: 403,
                    success: false,
                    message: `缺少权限: ${permission}`
                });
            }

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
