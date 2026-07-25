/**
 * CSRF防护
 * 支持令牌生成、验证、刷新，防重放攻击
 * @module csrf
 */

import { Request, Response, NextFunction } from 'express';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';

/**
 * CSRF配置接口
 */
export interface CsrfConfig {
  /** 令牌有效期（秒） */
  tokenTTL?: number;
  /** 令牌长度 */
  tokenLength?: number;
  /** Cookie名称 */
  cookieName?: string;
  /** Cookie选项 */
  cookieOptions?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
  };
  /** 排除的路径 */
  excludePaths?: RegExp[];
  /** 排除的方法 */
  excludeMethods?: string[];
  /** 是否启用 */
  enabled?: boolean;
  /** 是否验证Referer */
  checkReferer?: boolean;
  /** 是否验证Origin */
  checkOrigin?: boolean;
  /** 信任的域名 */
  trustedDomains?: string[];
}

/**
 * CSRF令牌信息
 */
export interface CsrfTokenInfo {
  /** 令牌值 */
  token: string;
  /** 创建时间 */
  createdAt: Date;
  /** 过期时间 */
  expiresAt: Date;
  /** 会话ID */
  sessionId?: string;
  /** 用户ID */
  userId?: string;
}

/**
 * 默认CSRF配置
 */
export const DEFAULT_CSRF_CONFIG: CsrfConfig = {
  tokenTTL: 3600, // 1小时
  tokenLength: 32,
  cookieName: '_csrf',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
  excludePaths: [
    /^\/api\/auth\/login/,
    /^\/api\/auth\/logout/,
    /^\/api\/auth\/register/,
    /^\/api\/auth\/refresh/,
    /^\/health/,
    /^\/metrics/,
  ],
  excludeMethods: ['GET', 'HEAD', 'OPTIONS'],
  enabled: true,
  checkReferer: true,
  checkOrigin: true,
  trustedDomains: [],
};

/**
 * CSRF管理器
 */
export class CsrfManager {
  private config: Required<CsrfConfig>;
  private tokenStore: Map<string, CsrfTokenInfo> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: CsrfConfig = {}) {
    this.config = {
      tokenTTL: 3600,
      tokenLength: 32,
      cookieName: '_csrf',
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        domain: undefined,
      },
      excludePaths: [
        /^\/api\/auth\/login/,
        /^\/api\/auth\/logout/,
        /^\/api\/auth\/register/,
        /^\/api\/auth\/refresh/,
        /^\/health/,
        /^\/metrics/,
      ],
      excludeMethods: ['GET', 'HEAD', 'OPTIONS'],
      enabled: true,
      checkReferer: true,
      checkOrigin: true,
      trustedDomains: [],
      ...config,
    };

    this.startCleanup();
  }

  /**
   * 启动定时清理
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60000); // 每分钟清理一次
  }

  /**
   * 清理过期令牌
   */
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [key, info] of this.tokenStore) {
      if (info.expiresAt.getTime() < now) {
        this.tokenStore.delete(key);
      }
    }
  }

  /**
   * 生成CSRF令牌
   */
  generateToken(sessionId?: string, userId?: string): string {
    const token = randomBytes(this.config.tokenLength).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.tokenTTL * 1000);

    this.tokenStore.set(token, {
      token,
      createdAt: now,
      expiresAt,
      sessionId,
      userId,
    });

    return token;
  }

  /**
   * 验证CSRF令牌
   */
  validateToken(token: string, sessionId?: string, userId?: string): boolean {
    if (!token) return false;

    const info = this.tokenStore.get(token);
    if (!info) return false;

    // 检查是否过期
    if (info.expiresAt.getTime() < Date.now()) {
      this.tokenStore.delete(token);
      return false;
    }

    // 验证会话ID
    if (sessionId && info.sessionId && info.sessionId !== sessionId) {
      return false;
    }

    // 验证用户ID
    if (userId && info.userId && info.userId !== userId) {
      return false;
    }

    // 使用时间安全比较防止时序攻击
    const storedToken = Buffer.from(token);
    const providedToken = Buffer.from(info.token);
    if (storedToken.length !== providedToken.length) {
      return false;
    }

    return timingSafeEqual(storedToken, providedToken);
  }

  /**
   * 刷新CSRF令牌
   */
  refreshToken(oldToken: string, sessionId?: string, userId?: string): string | null {
    if (!this.validateToken(oldToken, sessionId, userId)) {
      return null;
    }

    // 删除旧令牌
    this.tokenStore.delete(oldToken);

    // 生成新令牌
    return this.generateToken(sessionId, userId);
  }

  /**
   * 撤销CSRF令牌
   */
  revokeToken(token: string): boolean {
    if (!token) return false;
    return this.tokenStore.delete(token);
  }

  /**
   * 撤销用户所有令牌
   */
  revokeUserTokens(userId: string): number {
    let count = 0;
    for (const [key, info] of this.tokenStore) {
      if (info.userId === userId) {
        this.tokenStore.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * 获取令牌信息
   */
  getTokenInfo(token: string): CsrfTokenInfo | null {
    const info = this.tokenStore.get(token);
    if (!info) return null;
    if (info.expiresAt.getTime() < Date.now()) {
      this.tokenStore.delete(token);
      return null;
    }
    return { ...info };
  }

  /**
   * 检查请求是否应该排除CSRF验证
   */
  private shouldExclude(req: Request): boolean {
    // 检查方法
    if (this.config.excludeMethods.includes(req.method)) {
      return true;
    }

    // 检查路径
    for (const pattern of this.config.excludePaths) {
      if (pattern.test(req.path)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查Referer
   */
  private checkReferer(req: Request): boolean {
    if (!this.config.checkReferer) return true;

    const referer = req.headers.referer || req.headers.referrer;
    if (!referer) {
      // 没有Referer头，如果是API请求可能来自非浏览器
      // 根据配置决定是否允许
      return true;
    }

    try {
      const url = new URL(referer as string);
      const host = url.hostname;

      // 检查是否在信任域名列表中
      if (this.config.trustedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
        return true;
      }

      // 检查是否是同源请求
      const origin = req.headers.origin;
      if (origin) {
        const originUrl = new URL(origin);
        return host === originUrl.hostname;
      }

      // 从请求头获取主机
      const hostHeader = req.headers.host;
      if (hostHeader) {
        const hostname = hostHeader.split(':')[0];
        return host === hostname;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * 检查Origin
   */
  private checkOrigin(req: Request): boolean {
    if (!this.config.checkOrigin) return true;

    const origin = req.headers.origin;
    if (!origin) {
      // 没有Origin头，可能是同源请求
      return true;
    }

    try {
      const url = new URL(origin);
      const host = url.hostname;

      // 检查是否在信任域名列表中
      if (this.config.trustedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
        return true;
      }

      // 检查是否是同源请求
      const hostHeader = req.headers.host;
      if (hostHeader) {
        const hostname = hostHeader.split(':')[0];
        return host === hostname;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * 获取CSRF中间件
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      // 检查是否应该排除
      if (this.shouldExclude(req)) {
        return next();
      }

      // 检查Referer
      if (!this.checkReferer(req)) {
        return res.status(403).json({
          success: false,
          message: 'CSRF验证失败：无效的Referer',
          code: 'CSRF_REFERER_INVALID',
        });
      }

      // 检查Origin
      if (!this.checkOrigin(req)) {
        return res.status(403).json({
          success: false,
          message: 'CSRF验证失败：无效的Origin',
          code: 'CSRF_ORIGIN_INVALID',
        });
      }

      // 获取CSRF令牌
      const token = req.headers['x-csrf-token'] ||
                     req.headers['x-xsrf-token'] ||
                     req.body?._csrf ||
                     req.query?._csrf;

      if (!token) {
        return res.status(403).json({
          success: false,
          message: 'CSRF验证失败：缺少CSRF令牌',
          code: 'CSRF_TOKEN_MISSING',
        });
      }

      // 获取会话和用户信息
      const sessionId = (req as any).session?.id;
      const userId = (req as any).user?.id;

      // 验证令牌
      const isValid = this.validateToken(token as string, sessionId, userId);

      if (!isValid) {
        return res.status(403).json({
          success: false,
          message: 'CSRF验证失败：无效或过期的CSRF令牌',
          code: 'CSRF_TOKEN_INVALID',
        });
      }

      // 令牌有效，继续处理
      next();
    };
  }

  /**
   * 获取CSRF令牌生成中间件
   * 在响应中设置CSRF Cookie
   */
  getTokenMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      const sessionId = (req as any).session?.id;
      const userId = (req as any).user?.id;

      // 检查是否已经有有效的CSRF Cookie
      const existingToken = req.cookies?.[this.config.cookieName];
      if (existingToken && this.validateToken(existingToken, sessionId, userId)) {
        // 令牌有效，刷新过期时间
        this.tokenStore.set(existingToken, {
          ...this.tokenStore.get(existingToken)!,
          expiresAt: new Date(Date.now() + this.config.tokenTTL * 1000),
        });
        next();
        return;
      }

      // 生成新令牌
      const token = this.generateToken(sessionId, userId);

      // 设置Cookie
      res.cookie(this.config.cookieName, token, {
        ...this.config.cookieOptions,
        maxAge: this.config.tokenTTL * 1000,
      });

      // 在响应头中返回令牌（方便前端读取）
      res.setHeader('X-CSRF-Token', token);

      // 将令牌挂载到请求对象
      (req as any).csrfToken = token;

      next();
    };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<CsrfConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): CsrfConfig {
    return { ...this.config };
  }

  /**
   * 获取统计信息
   */
  getStats(): { totalTokens: number; expiredTokens: number; activeTokens: number } {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const info of this.tokenStore.values()) {
      if (info.expiresAt.getTime() < now) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      totalTokens: this.tokenStore.size,
      expiredTokens: expired,
      activeTokens: active,
    };
  }

  /**
   * 关闭CSRF管理器
   */
  async close(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.tokenStore.clear();
  }
}

/**
 * 创建CSRF管理器实例（工厂函数）
 */
export function createCsrfManager(config?: CsrfConfig): CsrfManager {
  return new CsrfManager(config);
}

export default CsrfManager;