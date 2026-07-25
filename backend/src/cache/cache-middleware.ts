/**
 * 缓存中间件
 * 支持路由级缓存控制、自动缓存拦截、缓存刷新、条件缓存
 * @module cache-middleware
 */

import { Request, Response, NextFunction } from 'express';
import { CacheManager } from './cache-manager';
import { CacheKeys } from './cache-keys';

/**
 * 缓存中间件配置
 */
export interface CacheMiddlewareConfig {
  /** 缓存管理器实例 */
  cacheManager: CacheManager;
  /** 默认TTL（秒） */
  defaultTTL?: number;
  /** 缓存键生成函数 */
  keyGenerator?: (req: Request) => string;
  /** 是否启用缓存 */
  enabled?: boolean;
  /** 缓存条件函数 */
  shouldCache?: (req: Request, res: Response) => boolean;
  /** 缓存排除路径 */
  excludePaths?: RegExp[];
  /** 缓存包含路径 */
  includePaths?: RegExp[];
  /** 缓存排除方法 */
  excludeMethods?: string[];
}

/**
 * 响应缓存数据
 */
interface CachedResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  timestamp: number;
}

/**
 * 缓存中间件类
 */
export class CacheMiddleware {
  private config: Required<CacheMiddlewareConfig>;

  constructor(config: CacheMiddlewareConfig) {
    this.config = {
      defaultTTL: 300, // 5分钟
      keyGenerator: this.defaultKeyGenerator.bind(this),
      enabled: true,
      shouldCache: this.defaultShouldCache.bind(this),
      excludePaths: [/^\/api\/auth/, /^\/api\/upload/, /^\/health/],
      includePaths: [],
      excludeMethods: ['POST', 'PUT', 'DELETE', 'PATCH'],
      ...config,
    };
  }

  /**
   * 默认缓存键生成器
   * 基于请求路径、查询参数、用户ID生成唯一缓存键
   */
  private defaultKeyGenerator(req: Request): string {
    const userId = (req as any).user?.id || 'anonymous';
    const queryString = JSON.stringify(req.query);
    const path = req.path;
    return CacheKeys.temp(`route:${path}:${queryString}:${userId}`);
  }

  /**
   * 默认缓存条件
   * 只缓存GET请求，且状态码为200
   */
  private defaultShouldCache(req: Request, res: Response): boolean {
    return req.method === 'GET' && res.statusCode === 200;
  }

  /**
   * 检查路径是否在排除列表中
   */
  private isExcludedPath(path: string): boolean {
    return this.config.excludePaths.some((pattern) => pattern.test(path));
  }

  /**
   * 检查路径是否在包含列表中
   */
  private isIncludedPath(path: string): boolean {
    if (this.config.includePaths.length === 0) return true;
    return this.config.includePaths.some((pattern) => pattern.test(path));
  }

  /**
   * 检查方法是否在排除列表中
   */
  private isExcludedMethod(method: string): boolean {
    return this.config.excludeMethods.includes(method);
  }

  /**
   * 获取中间件函数
   */
  getMiddleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // 检查是否启用缓存
      if (!this.config.enabled) {
        return next();
      }

      // 检查方法
      if (this.isExcludedMethod(req.method)) {
        return next();
      }

      // 检查路径
      if (this.isExcludedPath(req.path)) {
        return next();
      }

      if (!this.isIncludedPath(req.path)) {
        return next();
      }

      // 生成缓存键
      const cacheKey = this.config.keyGenerator(req);

      try {
        // 尝试获取缓存
        const cached = await this.config.cacheManager.get<CachedResponse>(cacheKey);

        if (cached) {
          // 缓存命中
          const ttl = await this.config.cacheManager.getTTL(cacheKey);
          const maxAge = Math.min(ttl, 3600);

          // 设置缓存头
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Cache-Key', cacheKey);
          res.setHeader('Cache-Control', `max-age=${maxAge}, public`);

          // 恢复响应状态码和头
          res.status(cached.statusCode);
          Object.entries(cached.headers).forEach(([name, value]) => {
            res.setHeader(name, value);
          });

          // 发送缓存响应
          res.json(cached.body);
          return;
        }

        // 缓存未命中，劫持响应
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);

        // 保存原始json方法
        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);
        const originalStatus = res.status.bind(res);

        let statusCode = 200;
        let responseBody: any = null;
        let responseHeaders: Record<string, string> = {};

        // 重写status方法
        res.status = function(code: number) {
          statusCode = code;
          return originalStatus(code);
        };

        // 重写json方法
        res.json = function(body: any) {
          responseBody = body;
          // 收集响应头
          const headers = res.getHeaders();
          Object.entries(headers).forEach(([name, value]) => {
            if (typeof value === 'string') {
              responseHeaders[name] = value;
            } else if (value !== undefined) {
              responseHeaders[name] = String(value);
            }
          });

          // 检查是否应该缓存
          const shouldCache = this.config.shouldCache(req, res);

          // 异步保存缓存（不阻塞响应）
          if (shouldCache) {
            const ttl = this.config.defaultTTL;
            const cachedResponse: CachedResponse = {
              statusCode,
              headers: responseHeaders,
              body: responseBody,
              timestamp: Date.now(),
            };

            this.config.cacheManager
              .set(cacheKey, cachedResponse, { ttl })
              .catch((error) => {
                console.error('[CacheMiddleware] 缓存保存失败:', error);
              });
          }

          return originalJson(body);
        };

        // 重写send方法（兼容）
        res.send = function(body: any) {
          if (typeof body === 'string') {
            try {
              responseBody = JSON.parse(body);
            } catch {
              responseBody = body;
            }
          } else {
            responseBody = body;
          }

          // 收集响应头
          const headers = res.getHeaders();
          Object.entries(headers).forEach(([name, value]) => {
            if (typeof value === 'string') {
              responseHeaders[name] = value;
            } else if (value !== undefined) {
              responseHeaders[name] = String(value);
            }
          });

          // 检查是否应该缓存
          const shouldCache = this.config.shouldCache(req, res);

          if (shouldCache) {
            const ttl = this.config.defaultTTL;
            const cachedResponse: CachedResponse = {
              statusCode,
              headers: responseHeaders,
              body: responseBody,
              timestamp: Date.now(),
            };

            this.config.cacheManager
              .set(cacheKey, cachedResponse, { ttl })
              .catch((error) => {
                console.error('[CacheMiddleware] 缓存保存失败:', error);
              });
          }

          return originalSend(body);
        };

        next();
      } catch (error) {
        console.error('[CacheMiddleware] 缓存处理失败:', error);
        // 缓存失败不影响正常请求
        next();
      }
    };
  }

  /**
   * 清除指定路径的缓存
   */
  async clearCacheByPath(req: Request): Promise<number> {
    const cacheKey = this.config.keyGenerator(req);
    const result = await this.config.cacheManager.del(cacheKey);
    return result ? 1 : 0;
  }

  /**
   * 清除指定模式的缓存
   */
  async clearCacheByPattern(pattern: string): Promise<number> {
    return this.config.cacheManager.delByPattern(pattern);
  }

  /**
   * 清除所有缓存
   */
  async clearAllCache(): Promise<boolean> {
    return this.config.cacheManager.clearAll();
  }

  /**
   * 获取缓存键生成器
   */
  getKeyGenerator(): (req: Request) => string {
    return this.config.keyGenerator;
  }
}

/**
 * 创建缓存中间件实例（工厂函数）
 */
export function createCacheMiddleware(
  cacheManager: CacheManager,
  config?: Partial<CacheMiddlewareConfig>
): CacheMiddleware {
  return new CacheMiddleware({
    cacheManager,
    ...config,
  });
}

/**
 * 缓存清除中间件
 * 用于在数据变更时清除相关缓存
 */
export function createCacheInvalidationMiddleware(cacheManager: CacheManager) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 在响应完成后清除缓存
    const originalJson = res.json.bind(res);

    res.json = function(body: any) {
      // 如果是成功响应，清除相关缓存
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // 根据请求路径生成清除模式
        const pathParts = req.path.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const resourceType = pathParts[0];
          const pattern = CacheKeys.prefixPattern(
            // 根据资源类型选择命名空间
            (() => {
              switch (resourceType) {
                case 'customers': return 'customer' as any;
                case 'orders': return 'order' as any;
                case 'products': return 'product' as any;
                case 'inventory': return 'inventory' as any;
                case 'finance': return 'finance' as any;
                default: return 'temp' as any;
              }
            })(),
            resourceType
          );
          // 异步清除缓存
          cacheManager.delByPattern(pattern.replace('*', '.*')).catch((error) => {
            console.error('[CacheInvalidation] 缓存清除失败:', error);
          });
        }
      }
      return originalJson(body);
    };

    next();
  };
}

export default CacheMiddleware;