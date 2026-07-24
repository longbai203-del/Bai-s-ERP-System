/**
 * @file src/middlewares/auth.middleware.ts
 * 认证中间件 - JWT验证与用户身份识别
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../Config';
import { logger } from '../../Config/winston.config';

// 扩展Express Request类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number | string;
        username: string;
        email: string;
        roles: string[];
        permissions: string[];
        tenantId?: string;
      };
      token?: string;
    }
  }
}

export interface AuthOptions {
  /** 是否必须认证 */
  required?: boolean;
  /** 允许的角色列表 */
  roles?: string[];
  /** 允许的权限列表 */
  permissions?: string[];
  /** 是否支持多租户 */
  multiTenant?: boolean;
}

/**
 * JWT令牌验证与解析
 */
export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    });
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('JWT_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('JWT_INVALID_TOKEN');
    }
    throw error;
  }
}

/**
 * 刷新令牌验证
 */
export function verifyRefreshToken(token: string): any {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    });
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }
    throw error;
  }
}

/**
 * 生成访问令牌
 */
export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  });
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(payload: any): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
  });
}

/**
 * 认证中间件工厂
 */
export function authMiddleware(options: AuthOptions = {}) {
  const {
    required = true,
    roles = [],
    permissions = [],
    multiTenant = false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 获取令牌
      const authHeader = req.headers.authorization;
      let token: string | undefined;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else if (req.query.token) {
        token = req.query.token as string;
      } else if (req.cookies?.access_token) {
        token = req.cookies.access_token;
      }

      // 如果认证不是必须的且没有令牌，直接放行
      if (!required && !token) {
        return next();
      }

      // 如果认证是必须的但没有令牌
      if (required && !token) {
        res.status(401).json({
          success: false,
          code: 'AUTH_REQUIRED',
          message: '请先登录',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // 验证令牌
      const decoded = verifyToken(token!);
      req.user = {
        id: decoded.sub || decoded.id,
        username: decoded.username || decoded.email,
        email: decoded.email,
        roles: decoded.roles || [],
        permissions: decoded.permissions || [],
        tenantId: decoded.tenantId,
      };
      req.token = token;

      // 检查角色权限
      if (roles.length > 0) {
        const hasRole = roles.some(role => req.user!.roles.includes(role));
        if (!hasRole) {
          logger.warn(`用户 ${req.user.username} 无角色权限`, {
            userId: req.user.id,
            requiredRoles: roles,
            userRoles: req.user.roles,
          });
          res.status(403).json({
            success: false,
            code: 'FORBIDDEN_ROLE',
            message: '角色权限不足',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // 检查功能权限
      if (permissions.length > 0) {
        const hasPermission = permissions.some(perm => req.user!.permissions.includes(perm));
        if (!hasPermission) {
          logger.warn(`用户 ${req.user.username} 无功能权限`, {
            userId: req.user.id,
            requiredPermissions: permissions,
            userPermissions: req.user.permissions,
          });
          res.status(403).json({
            success: false,
            code: 'FORBIDDEN_PERMISSION',
            message: '功能权限不足',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      // 多租户验证
      if (multiTenant) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId) {
          res.status(400).json({
            success: false,
            code: 'TENANT_REQUIRED',
            message: '租户ID不能为空',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        req.user.tenantId = tenantId as string;
      }

      // 记录认证日志
      logger.debug(`用户认证成功: ${req.user.username}`, {
        userId: req.user.id,
        path: req.path,
        method: req.method,
      });

      next();
    } catch (error) {
      const err = error as Error;
      let statusCode = 401;
      let message = '认证失败';
      let code = 'AUTH_FAILED';

      if (err.message === 'JWT_TOKEN_EXPIRED') {
        message = '令牌已过期';
        code = 'TOKEN_EXPIRED';
      } else if (err.message === 'JWT_INVALID_TOKEN') {
        message = '无效的令牌';
        code = 'INVALID_TOKEN';
      } else if (err.message === 'REFRESH_TOKEN_EXPIRED') {
        message = '刷新令牌已过期，请重新登录';
        code = 'REFRESH_EXPIRED';
        statusCode = 401;
      } else {
        logger.error('认证中间件错误:', err);
        message = '认证过程发生错误';
        code = 'AUTH_ERROR';
        statusCode = 500;
      }

      res.status(statusCode).json({
        success: false,
        code,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * 可选认证 - 如果提供了令牌则验证，否则放行
 */
export const optionalAuth = authMiddleware({ required: false });

/**
 * 管理员认证
 */
export const adminAuth = authMiddleware({
  required: true,
  roles: ['admin', 'super_admin'],
});

/**
 * 权限检查装饰器
 */
export function requirePermission(permission: string | string[]) {
  return authMiddleware({
    required: true,
    permissions: Array.isArray(permission) ? permission : [permission],
  });
}

export default authMiddleware;