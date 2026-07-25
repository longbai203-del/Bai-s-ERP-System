/**
 * 速率限制器
 * 支持滑动窗口、令牌桶、漏桶算法，防DDoS和暴力破解
 * @module rate-limiter
 */

import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';

/**
 * 限流算法
 */
export enum RateLimitAlgorithm {
  /** 滑动窗口 */
  SLIDING_WINDOW = 'sliding_window',
  /** 令牌桶 */
  TOKEN_BUCKET = 'token_bucket',
  /** 漏桶 */
  LEAKY_BUCKET = 'leaky_bucket',
  /** 固定窗口 */
  FIXED_WINDOW = 'fixed_window',
}

/**
 * 限流配置
 */
export interface RateLimitConfig {
  /** 限流算法 */
  algorithm?: RateLimitAlgorithm;
  /** 窗口大小（毫秒） */
  windowMs?: number;
  /** 最大请求数 */
  maxRequests?: number;
  /** 令牌桶容量 */
  bucketCapacity?: number;
  /** 令牌生成速率（每秒） */
  refillRate?: number;
  /** 是否启用 */
  enabled?: boolean;
  /** 白名单IP */
  whitelist?: string[];
  /** 黑名单IP */
  blacklist?: string[];
  /** 限流键生成器 */
  keyGenerator?: (req: Request) => string;
  /** 是否跳过限流 */
  skip?: (req: Request) => boolean;
  /** 自定义响应 */
  handler?: (req: Request, res: Response) => void;
}

/**
 * 限流状态
 */
export interface RateLimitState {
  /** 总请求数 */
  totalRequests: number;
  /** 当前窗口请求数 */
  currentRequests: number;
  /** 剩余令牌 */
  remainingTokens: number;
  /** 重置时间 */
  resetTime: Date;
  /** 是否被限流 */
  isLimited: boolean;
  /** 限流原因 */
  limitReason?: string;
}

/**
 * 限流统计
 */
export interface RateLimitStats {
  /** 总请求数 */
  totalRequests: number;
  /** 被限流请求数 */
  limitedRequests: number;
  /** 限流率 */
  limitRate: number;
  /** 活跃键数 */
  activeKeys: number;
  /** 按键统计 */
  byKey: Record<string, { requests: number; limited: number }>;
}

/**
 * 默认限流配置
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
  windowMs: 60000, // 1分钟
  maxRequests: 100,
  bucketCapacity: 100,
  refillRate: 10, // 每秒10个令牌
  enabled: true,
  whitelist: [],
  blacklist: [],
};

/**
 * 内存存储的限流数据
 */
interface RateLimitData {
  count: number;
  firstRequest: number;
  lastRequest: number;
  tokens: number;
  lastRefill: number;
  limited: number;
}

/**
 * 速率限制器
 */
export class RateLimiter extends EventEmitter {
  private config: Required<RateLimitConfig>;
  private store: Map<string, RateLimitData> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;
  private stats: RateLimitStats = {
    totalRequests: 0,
    limitedRequests: 0,
    limitRate: 0,
    activeKeys: 0,
    byKey: {},
  };

  constructor(config: RateLimitConfig = {}) {
    super();
    this.config = {
      algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
      windowMs: 60000,
      maxRequests: 100,
      bucketCapacity: 100,
      refillRate: 10,
      enabled: true,
      whitelist: [],
      blacklist: [],
      keyGenerator: this.defaultKeyGenerator.bind(this),
      skip: () => false,
      handler: this.defaultHandler.bind(this),
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
      this.cleanupExpiredKeys();
    }, 60000); // 每分钟清理一次
  }

  /**
   * 清理过期键
   */
  private cleanupExpiredKeys(): void {
    const now = Date.now();
    const expiredWindow = this.config.windowMs;

    for (const [key, data] of this.store) {
      if (now - data.lastRequest > expiredWindow * 2) {
        this.store.delete(key);
        delete this.stats.byKey[key];
      }
    }

    this.stats.activeKeys = this.store.size;
  }

  /**
   * 默认键生成器
   */
  private defaultKeyGenerator(req: Request): string {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const path = req.path;
    const method = req.method;
    const userId = (req as any).user?.id || 'anonymous';

    return `${ip}:${method}:${path}:${userId}`;
  }

  /**
   * 默认限流响应处理器
   */
  private defaultHandler(req: Request, res: Response): void {
    res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(this.config.windowMs / 1000),
    });
  }

  /**
   * 滑动窗口算法检查
   */
  private checkSlidingWindow(key: string): RateLimitState {
    const now = Date.now();
    const windowMs = this.config.windowMs;
    const maxRequests = this.config.maxRequests;

    let data = this.store.get(key);
    if (!data) {
      data = {
        count: 0,
        firstRequest: now,
        lastRequest: now,
        tokens: 0,
        lastRefill: now,
        limited: 0,
      };
    }

    // 检查是否在窗口期内
    if (now - data.firstRequest > windowMs) {
      // 滑动窗口：重置计数，但保留部分历史
      const remaining = Math.floor((now - data.firstRequest) / windowMs);
      const newCount = Math.max(0, data.count - remaining * maxRequests);
      data.count = newCount;
      data.firstRequest = now - (now - data.firstRequest) % windowMs;
    }

    const isLimited = data.count >= maxRequests;
    const resetTime = new Date(data.firstRequest + windowMs);

    if (isLimited) {
      data.limited++;
      this.stats.limitedRequests++;
    } else {
      data.count++;
    }

    data.lastRequest = now;
    this.store.set(key, data);

    // 更新统计
    this.stats.totalRequests++;
    if (!this.stats.byKey[key]) {
      this.stats.byKey[key] = { requests: 0, limited: 0 };
    }
    this.stats.byKey[key].requests++;
    if (isLimited) {
      this.stats.byKey[key].limited++;
    }
    this.stats.limitRate = this.stats.totalRequests > 0
      ? this.stats.limitedRequests / this.stats.totalRequests
      : 0;
    this.stats.activeKeys = this.store.size;

    return {
      totalRequests: this.stats.totalRequests,
      currentRequests: data.count,
      remainingTokens: maxRequests - data.count,
      resetTime,
      isLimited,
    };
  }

  /**
   * 令牌桶算法检查
   */
  private checkTokenBucket(key: string): RateLimitState {
    const now = Date.now();
    const capacity = this.config.bucketCapacity;
    const refillRate = this.config.refillRate;

    let data = this.store.get(key);
    if (!data) {
      data = {
        count: 0,
        firstRequest: now,
        lastRequest: now,
        tokens: capacity,
        lastRefill: now,
        limited: 0,
      };
    }

    // 补充令牌
    const timeSinceRefill = (now - data.lastRefill) / 1000;
    const tokensToAdd = timeSinceRefill * refillRate;

    data.tokens = Math.min(capacity, data.tokens + tokensToAdd);
    data.lastRefill = now;

    const isLimited = data.tokens < 1;
    const resetTime = new Date(now + (capacity / refillRate) * 1000);

    if (isLimited) {
      data.limited++;
      this.stats.limitedRequests++;
    } else {
      data.tokens--;
      data.count++;
    }

    data.lastRequest = now;
    this.store.set(key, data);

    // 更新统计
    this.stats.totalRequests++;
    if (!this.stats.byKey[key]) {
      this.stats.byKey[key] = { requests: 0, limited: 0 };
    }
    this.stats.byKey[key].requests++;
    if (isLimited) {
      this.stats.byKey[key].limited++;
    }
    this.stats.limitRate = this.stats.totalRequests > 0
      ? this.stats.limitedRequests / this.stats.totalRequests
      : 0;
    this.stats.activeKeys = this.store.size;

    return {
      totalRequests: this.stats.totalRequests,
      currentRequests: data.count,
      remainingTokens: Math.floor(data.tokens),
      resetTime,
      isLimited,
    };
  }

  /**
   * 漏桶算法检查
   */
  private checkLeakyBucket(key: string): RateLimitState {
    const now = Date.now();
    const maxRequests = this.config.maxRequests;
    const windowMs = this.config.windowMs;
    const rate = maxRequests / (windowMs / 1000); // 每秒处理速率

    let data = this.store.get(key);
    if (!data) {
      data = {
        count: 0,
        firstRequest: now,
        lastRequest: now,
        tokens: 0,
        lastRefill: now,
        limited: 0,
      };
    }

    // 计算漏出的请求数
    const timeSinceLastRequest = (now - data.lastRequest) / 1000;
    const leaked = timeSinceLastRequest * rate;

    data.count = Math.max(0, data.count - leaked);
    data.lastRequest = now;

    const isLimited = data.count >= maxRequests;
    const resetTime = new Date(now + (maxRequests / rate) * 1000);

    if (isLimited) {
      data.limited++;
      this.stats.limitedRequests++;
    } else {
      data.count++;
    }

    this.store.set(key, data);

    // 更新统计
    this.stats.totalRequests++;
    if (!this.stats.byKey[key]) {
      this.stats.byKey[key] = { requests: 0, limited: 0 };
    }
    this.stats.byKey[key].requests++;
    if (isLimited) {
      this.stats.byKey[key].limited++;
    }
    this.stats.limitRate = this.stats.totalRequests > 0
      ? this.stats.limitedRequests / this.stats.totalRequests
      : 0;
    this.stats.activeKeys = this.store.size;

    return {
      totalRequests: this.stats.totalRequests,
      currentRequests: data.count,
      remainingTokens: maxRequests - data.count,
      resetTime,
      isLimited,
    };
  }

  /**
   * 固定窗口算法检查
   */
  private checkFixedWindow(key: string): RateLimitState {
    const now = Date.now();
    const windowMs = this.config.windowMs;
    const maxRequests = this.config.maxRequests;

    let data = this.store.get(key);
    if (!data) {
      data = {
        count: 0,
        firstRequest: now,
        lastRequest: now,
        tokens: 0,
        lastRefill: now,
        limited: 0,
      };
    }

    // 检查是否需要重置窗口
    if (now - data.firstRequest > windowMs) {
      data.count = 0;
      data.firstRequest = now;
    }

    const isLimited = data.count >= maxRequests;
    const resetTime = new Date(data.firstRequest + windowMs);

    if (isLimited) {
      data.limited++;
      this.stats.limitedRequests++;
    } else {
      data.count++;
    }

    data.lastRequest = now;
    this.store.set(key, data);

    // 更新统计
    this.stats.totalRequests++;
    if (!this.stats.byKey[key]) {
      this.stats.byKey[key] = { requests: 0, limited: 0 };
    }
    this.stats.byKey[key].requests++;
    if (isLimited) {
      this.stats.byKey[key].limited++;
    }
    this.stats.limitRate = this.stats.totalRequests > 0
      ? this.stats.limitedRequests / this.stats.totalRequests
      : 0;
    this.stats.activeKeys = this.store.size;

    return {
      totalRequests: this.stats.totalRequests,
      currentRequests: data.count,
      remainingTokens: maxRequests - data.count,
      resetTime,
      isLimited,
    };
  }

  /**
   * 检查是否被限流
   */
  check(key: string): RateLimitState {
    if (!this.config.enabled) {
      return {
        totalRequests: 0,
        currentRequests: 0,
        remainingTokens: this.config.maxRequests,
        resetTime: new Date(Date.now() + this.config.windowMs),
        isLimited: false,
      };
    }

    switch (this.config.algorithm) {
      case RateLimitAlgorithm.TOKEN_BUCKET:
        return this.checkTokenBucket(key);
      case RateLimitAlgorithm.LEAKY_BUCKET:
        return this.checkLeakyBucket(key);
      case RateLimitAlgorithm.FIXED_WINDOW:
        return this.checkFixedWindow(key);
      case RateLimitAlgorithm.SLIDING_WINDOW:
      default:
        return this.checkSlidingWindow(key);
    }
  }

  /**
   * 获取限流中间件
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      // 检查是否启用
      if (!this.config.enabled) {
        return next();
      }

      // 检查是否需要跳过
      if (this.config.skip(req)) {
        return next();
      }

      // 检查IP黑名单
      const ip = req.ip || req.connection.remoteAddress || '';
      if (this.config.blacklist.some((b) => ip.includes(b))) {
        this.emit('blacklisted', { ip, req });
        return res.status(403).json({
          success: false,
          message: 'IP已被禁止访问',
          code: 'IP_BLACKLISTED',
        });
      }

      // 检查IP白名单
      if (this.config.whitelist.some((w) => ip.includes(w))) {
        this.emit('whitelisted', { ip, req });
        return next();
      }

      // 生成限流键
      const key = this.config.keyGenerator(req);

      // 检查限流
      const state = this.check(key);

      // 设置限流头
      res.setHeader('X-RateLimit-Limit', String(this.config.maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(state.remainingTokens));
      res.setHeader('X-RateLimit-Reset', String(Math.floor(state.resetTime.getTime() / 1000)));

      // 如果被限流
      if (state.isLimited) {
        this.emit('limited', { key, state, req });
        res.setHeader('Retry-After', String(Math.ceil((state.resetTime.getTime() - Date.now()) / 1000)));
        return this.config.handler(req, res);
      }

      // 继续处理
      this.emit('allowed', { key, state, req });
      next();
    };
  }

  /**
   * 重置限流状态
   */
  reset(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * 重置所有限流状态
   */
  resetAll(): void {
    this.store.clear();
    this.stats = {
      totalRequests: 0,
      limitedRequests: 0,
      limitRate: 0,
      activeKeys: 0,
      byKey: {},
    };
  }

  /**
   * 获取限流状态
   */
  getState(key: string): RateLimitState | null {
    const data = this.store.get(key);
    if (!data) return null;

    const now = Date.now();
    const windowMs = this.config.windowMs;
    const maxRequests = this.config.maxRequests;

    return {
      totalRequests: this.stats.totalRequests,
      currentRequests: data.count,
      remainingTokens: maxRequests - data.count,
      resetTime: new Date(data.firstRequest + windowMs),
      isLimited: data.count >= maxRequests,
    };
  }

  /**
   * 获取所有限流状态
   */
  getAllStates(): Record<string, RateLimitState> {
    const states: Record<string, RateLimitState> = {};
    for (const [key] of this.store) {
      const state = this.getState(key);
      if (state) {
        states[key] = state;
      }
    }
    return states;
  }

  /**
   * 获取统计信息
   */
  getStats(): RateLimitStats {
    return { ...this.stats };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<RateLimitConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): RateLimitConfig {
    return { ...this.config };
  }

  /**
   * 添加IP到白名单
   */
  addToWhitelist(ip: string): void {
    if (!this.config.whitelist.includes(ip)) {
      this.config.whitelist.push(ip);
    }
  }

  /**
   * 从白名单移除IP
   */
  removeFromWhitelist(ip: string): void {
    this.config.whitelist = this.config.whitelist.filter((w) => w !== ip);
  }

  /**
   * 添加IP到黑名单
   */
  addToBlacklist(ip: string): void {
    if (!this.config.blacklist.includes(ip)) {
      this.config.blacklist.push(ip);
    }
  }

  /**
   * 从黑名单移除IP
   */
  removeFromBlacklist(ip: string): void {
    this.config.blacklist = this.config.blacklist.filter((b) => b !== ip);
  }

  /**
   * 关闭限流器
   */
  async close(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.store.clear();
  }
}

/**
 * 创建限流器实例（工厂函数）
 */
export function createRateLimiter(config?: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

/**
 * 从环境变量创建限流配置
 */
export function createRateLimiterFromEnv(): RateLimiter {
  const config: RateLimitConfig = {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    algorithm: (process.env.RATE_LIMIT_ALGORITHM as RateLimitAlgorithm) || RateLimitAlgorithm.SLIDING_WINDOW,
    bucketCapacity: parseInt(process.env.RATE_LIMIT_BUCKET_CAPACITY || '100'),
    refillRate: parseInt(process.env.RATE_LIMIT_REFILL_RATE || '10'),
  };

  // 解析白名单
  const whitelist = process.env.RATE_LIMIT_WHITELIST;
  if (whitelist) {
    config.whitelist = whitelist.split(',').map((w) => w.trim());
  }

  // 解析黑名单
  const blacklist = process.env.RATE_LIMIT_BLACKLIST;
  if (blacklist) {
    config.blacklist = blacklist.split(',').map((b) => b.trim());
  }

  return new RateLimiter(config);
}

export default RateLimiter;