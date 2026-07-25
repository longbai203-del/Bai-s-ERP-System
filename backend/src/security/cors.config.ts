/**
 * CORS配置
 * 支持动态白名单、预检请求、凭证传递、自定义头
 * @module cors.config
 */

import { Request, Response, NextFunction } from 'express';

/**
 * CORS配置接口
 */
export interface CorsConfig {
  /** 允许的源 */
  origins?: string | string[] | RegExp | ((origin: string) => boolean);
  /** 允许的方法 */
  methods?: string[];
  /** 允许的请求头 */
  allowedHeaders?: string[];
  /** 暴露的响应头 */
  exposedHeaders?: string[];
  /** 是否允许凭证 */
  credentials?: boolean;
  /** 预检请求缓存时间（秒） */
  maxAge?: number;
  /** 是否启用 */
  enabled?: boolean;
  /** 是否允许所有源 */
  allowAll?: boolean;
  /** 环境白名单 */
  environmentWhitelist?: Record<string, string[]>;
}

/**
 * 默认CORS配置
 */
export const DEFAULT_CORS_CONFIG: CorsConfig = {
  origins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-CSRF-Token',
    'X-Trace-ID',
    'X-Request-ID',
    'Range',
    'If-Match',
    'If-None-Match',
    'If-Modified-Since',
    'If-Unmodified-Since',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Pagination-Page',
    'X-Pagination-Limit',
    'X-Pagination-Total',
    'X-Request-ID',
    'X-Trace-ID',
    'X-Cache',
    'Content-Range',
    'ETag',
  ],
  credentials: true,
  maxAge: 86400, // 24小时
  enabled: true,
  allowAll: false,
};

/**
 * CORS管理器
 */
export class CorsManager {
  private config: CorsConfig;
  private originCache: Map<string, boolean> = new Map();

  constructor(config: Partial<CorsConfig> = {}) {
    this.config = {
      ...DEFAULT_CORS_CONFIG,
      ...config,
    };
  }

  /**
   * 检查源是否被允许
   */
  isOriginAllowed(origin: string): boolean {
    if (!origin) return true;

    // 检查缓存
    if (this.originCache.has(origin)) {
      return this.originCache.get(origin)!;
    }

    let allowed = false;

    // 允许所有
    if (this.config.allowAll) {
      allowed = true;
    } else if (this.config.origins) {
      if (Array.isArray(this.config.origins)) {
        allowed = this.config.origins.some((o) => {
          if (o instanceof RegExp) {
            return o.test(origin);
          }
          return o === origin;
        });
      } else if (typeof this.config.origins === 'function') {
        allowed = this.config.origins(origin);
      } else if (this.config.origins instanceof RegExp) {
        allowed = this.config.origins.test(origin);
      } else {
        allowed = this.config.origins === origin;
      }
    }

    // 检查环境白名单
    if (!allowed && this.config.environmentWhitelist) {
      const env = process.env.NODE_ENV || 'development';
      const whitelist = this.config.environmentWhitelist[env];
      if (whitelist) {
        allowed = whitelist.some((o) => {
          if (o.includes('*')) {
            const pattern = o.replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`).test(origin);
          }
          return o === origin;
        });
      }
    }

    this.originCache.set(origin, allowed);
    return allowed;
  }

  /**
   * 获取CORS中间件
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      const origin = req.headers.origin as string;

      // 处理预检请求
      const isPreflight = req.method === 'OPTIONS';

      // 检查来源
      let allowedOrigin = '';
      if (this.config.allowAll) {
        allowedOrigin = '*';
      } else if (origin && this.isOriginAllowed(origin)) {
        allowedOrigin = origin;
      } else {
        // 如果来源不被允许，但有允许的源列表，使用第一个
        if (Array.isArray(this.config.origins) && this.config.origins.length > 0) {
          const firstAllowed = this.config.origins.find((o) => {
            if (typeof o === 'string') return o !== '*';
            return true;
          });
          if (firstAllowed && typeof firstAllowed === 'string') {
            allowedOrigin = firstAllowed;
          }
        }
      }

      // 设置CORS头
      if (allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      }

      // 允许凭证
      if (this.config.credentials && allowedOrigin !== '*') {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      // 允许方法
      if (this.config.methods && this.config.methods.length > 0) {
        res.setHeader(
          'Access-Control-Allow-Methods',
          this.config.methods.join(', ')
        );
      }

      // 允许请求头
      if (this.config.allowedHeaders && this.config.allowedHeaders.length > 0) {
        // 添加请求中实际发送的头
        const requestedHeaders = req.headers['access-control-request-headers'];
        const headers = [...this.config.allowedHeaders];
        if (requestedHeaders) {
          requestedHeaders.split(',').forEach((h) => {
            const trimmed = h.trim();
            if (!headers.includes(trimmed)) {
              headers.push(trimmed);
            }
          });
        }
        res.setHeader('Access-Control-Allow-Headers', headers.join(', '));
      }

      // 暴露响应头
      if (this.config.exposedHeaders && this.config.exposedHeaders.length > 0) {
        res.setHeader('Access-Control-Expose-Headers', this.config.exposedHeaders.join(', '));
      }

      // 预检请求缓存
      if (isPreflight && this.config.maxAge !== undefined) {
        res.setHeader('Access-Control-Max-Age', String(this.config.maxAge));
      }

      // 额外安全头
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');

      // 预检请求直接结束
      if (isPreflight) {
        res.status(204).end();
        return;
      }

      next();
    };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<CorsConfig>): void {
    this.config = { ...this.config, ...config };
    this.originCache.clear();
  }

  /**
   * 获取当前配置
   */
  getConfig(): CorsConfig {
    return { ...this.config };
  }

  /**
   * 添加允许的源
   */
  addOrigin(origin: string): void {
    if (Array.isArray(this.config.origins)) {
      if (!this.config.origins.includes(origin)) {
        (this.config.origins as string[]).push(origin);
      }
    } else {
      this.config.origins = [origin];
    }
    this.originCache.clear();
  }

  /**
   * 移除允许的源
   */
  removeOrigin(origin: string): void {
    if (Array.isArray(this.config.origins)) {
      this.config.origins = (this.config.origins as string[]).filter((o) => o !== origin);
      this.originCache.delete(origin);
    }
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.originCache.clear();
  }
}

/**
 * 创建CORS管理器实例（工厂函数）
 */
export function createCorsManager(config?: Partial<CorsConfig>): CorsManager {
  return new CorsManager(config);
}

/**
 * 从环境变量创建CORS配置
 */
export function createCorsConfigFromEnv(): CorsConfig {
  const config: CorsConfig = {
    enabled: process.env.CORS_ENABLED !== 'false',
    allowAll: process.env.CORS_ALLOW_ALL === 'true',
    credentials: process.env.CORS_CREDENTIALS !== 'false',
    maxAge: parseInt(process.env.CORS_MAX_AGE || '86400'),
  };

  // 解析允许的源
  const origins = process.env.CORS_ORIGINS;
  if (origins) {
    config.origins = origins.split(',').map((o) => o.trim());
  }

  // 解析允许的方法
  const methods = process.env.CORS_METHODS;
  if (methods) {
    config.methods = methods.split(',').map((m) => m.trim().toUpperCase());
  }

  // 解析允许的头
  const headers = process.env.CORS_HEADERS;
  if (headers) {
    config.allowedHeaders = headers.split(',').map((h) => h.trim());
  }

  // 解析暴露的头
  const exposed = process.env.CORS_EXPOSED_HEADERS;
  if (exposed) {
    config.exposedHeaders = exposed.split(',').map((h) => h.trim());
  }

  // 环境白名单
  const envWhitelist = process.env.CORS_ENV_WHITELIST;
  if (envWhitelist) {
    try {
      config.environmentWhitelist = JSON.parse(envWhitelist);
    } catch (error) {
      console.warn('[CORS] 解析环境白名单失败:', error);
    }
  }

  return config;
}

export default CorsManager;