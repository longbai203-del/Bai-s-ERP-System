/**
 * 企业级缓存管理器
 * 支持多级缓存策略、缓存降级、批量操作、事件通知
 * @module cache-manager
 */

import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { CacheKeys, DefaultTTL, CacheNamespace } from './cache-keys';

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  /** Redis连接配置 */
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    retryStrategy?: (times: number) => number;
    maxRetriesPerRequest?: number;
    enableReadyCheck?: boolean;
  };
  /** 默认TTL（秒） */
  defaultTTL?: number;
  /** 是否启用缓存降级 */
  enableFallback?: boolean;
  /** 降级存储（内存缓存）最大条目数 */
  fallbackMaxSize?: number;
  /** 是否启用压缩 */
  enableCompression?: boolean;
  /** 压缩阈值（字节） */
  compressionThreshold?: number;
}

/**
 * 缓存选项接口
 */
export interface CacheOptions {
  /** TTL（秒），覆盖默认值 */
  ttl?: number;
  /** 是否压缩存储 */
  compress?: boolean;
  /** 是否跳过缓存（强制从数据源获取） */
  skipCache?: boolean;
  /** 缓存标签（用于批量清除） */
  tags?: string[];
  /** 是否启用降级 */
  allowFallback?: boolean;
}

/**
 * 缓存统计信息
 */
export interface CacheStats {
  /** 总请求数 */
  totalRequests: number;
  /** 缓存命中次数 */
  hits: number;
  /** 缓存未命中次数 */
  misses: number;
  /** 缓存命中率 */
  hitRate: number;
  /** 写入次数 */
  writes: number;
  /** 删除次数 */
  deletes: number;
  /** 内存缓存命中次数 */
  memoryHits: number;
  /** 内存缓存大小 */
  memorySize: number;
}

/**
 * 内存缓存项
 */
interface MemoryCacheItem<T = any> {
  value: T;
  expireAt: number;
  tags?: string[];
}

/**
 * 缓存事件类型
 */
export enum CacheEvent {
  /** 缓存命中 */
  HIT = 'hit',
  /** 缓存未命中 */
  MISS = 'miss',
  /** 缓存写入 */
  WRITE = 'write',
  /** 缓存删除 */
  DELETE = 'delete',
  /** 缓存清除 */
  CLEAR = 'clear',
  /** 缓存错误 */
  ERROR = 'error',
  /** 缓存降级 */
  FALLBACK = 'fallback',
}

/**
 * 企业级缓存管理器
 */
export class CacheManager extends EventEmitter {
  private redis: Redis | null = null;
  private memoryCache: Map<string, MemoryCacheItem> = new Map();
  private config: Required<CacheConfig>;
  private stats: CacheStats = {
    totalRequests: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    writes: 0,
    deletes: 0,
    memoryHits: 0,
    memorySize: 0,
  };
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: CacheConfig) {
    super();
    this.config = {
      defaultTTL: DefaultTTL.MEDIUM,
      enableFallback: true,
      fallbackMaxSize: 10000,
      enableCompression: true,
      compressionThreshold: 1024 * 10, // 10KB
      ...config,
    };
    this.initialize();
  }

  /**
   * 初始化缓存管理器
   */
  private async initialize(): Promise<void> {
    try {
      await this.connectRedis();
    } catch (error) {
      console.error('[CacheManager] Redis连接失败，使用内存缓存降级:', error);
      if (this.config.enableFallback) {
        this.emit(CacheEvent.FALLBACK, { reason: 'Redis连接失败' });
      }
    }
  }

  /**
   * 连接Redis
   */
  private async connectRedis(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }

    const { host, port, password, db, keyPrefix, retryStrategy, maxRetriesPerRequest, enableReadyCheck } =
      this.config.redis;

    this.redis = new Redis({
      host,
      port,
      password,
      db: db || 0,
      keyPrefix: keyPrefix || 'bai:erp:cache:',
      retryStrategy: retryStrategy || ((times: number) => {
        const delay = Math.min(times * 100, 3000);
        if (times > 10) {
          console.error('[CacheManager] Redis重连失败次数过多，停止重试');
          return null;
        }
        return delay;
      }),
      maxRetriesPerRequest: maxRetriesPerRequest || 3,
      enableReadyCheck: enableReadyCheck !== false,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      console.log('[CacheManager] Redis连接成功');
      this.isConnected = true;
      this.emit('connected');
    });

    this.redis.on('error', (error) => {
      console.error('[CacheManager] Redis错误:', error);
      this.isConnected = false;
      this.emit(CacheEvent.ERROR, error);
    });

    this.redis.on('close', () => {
      console.log('[CacheManager] Redis连接关闭');
      this.isConnected = false;
      this.emit('disconnected');
    });

    await this.redis.connect();
  }

  /**
   * 检查Redis是否可用
   */
  private isRedisAvailable(): boolean {
    return this.isConnected && this.redis !== null && this.redis.status === 'ready';
  }

  /**
   * 压缩数据
   */
  private compress(data: any): string {
    try {
      const json = JSON.stringify(data);
      if (json.length > this.config.compressionThreshold && this.config.enableCompression) {
        // 简单压缩：使用Base64编码（实际项目可使用zlib）
        return Buffer.from(json).toString('base64');
      }
      return json;
    } catch (error) {
      return JSON.stringify(data);
    }
  }

  /**
   * 解压数据
   */
  private decompress(data: string): any {
    try {
      // 尝试Base64解码
      const buffer = Buffer.from(data, 'base64');
      const decoded = buffer.toString('utf-8');
      // 检查是否为有效的JSON
      if (decoded.startsWith('{') || decoded.startsWith('[')) {
        return JSON.parse(decoded);
      }
      return JSON.parse(data);
    } catch {
      return JSON.parse(data);
    }
  }

  /**
   * 获取缓存值
   */
  async get<T = any>(key: string, options?: CacheOptions): Promise<T | null> {
    this.stats.totalRequests++;

    if (options?.skipCache) {
      this.stats.misses++;
      return null;
    }

    // 先查内存缓存
    const memoryResult = this.getFromMemory<T>(key);
    if (memoryResult !== null) {
      this.stats.hits++;
      this.stats.memoryHits++;
      this.emit(CacheEvent.HIT, { key, source: 'memory' });
      return memoryResult;
    }

    // 查Redis
    if (this.isRedisAvailable()) {
      try {
        const result = await this.redis!.get(key);
        if (result !== null) {
          this.stats.hits++;
          this.emit(CacheEvent.HIT, { key, source: 'redis' });
          const data = this.decompress(result);
          // 同步到内存缓存
          this.setToMemory(key, data, options?.ttl || this.config.defaultTTL);
          return data as T;
        }
      } catch (error) {
        console.error(`[CacheManager] Redis GET失败 [${key}]:`, error);
        this.emit(CacheEvent.ERROR, { key, error });
      }
    }

    this.stats.misses++;
    this.emit(CacheEvent.MISS, { key });
    return null;
  }

  /**
   * 从内存缓存获取
   */
  private getFromMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (item) {
      if (item.expireAt > Date.now()) {
        return item.value as T;
      }
      this.memoryCache.delete(key);
    }
    return null;
  }

  /**
   * 写入内存缓存
   */
  private setToMemory(key: string, value: any, ttl: number): void {
    if (this.memoryCache.size >= this.config.fallbackMaxSize) {
      // LRU清理：删除最早过期的项
      let oldestKey: string | null = null;
      let oldestExpire = Infinity;
      for (const [k, v] of this.memoryCache) {
        if (v.expireAt < oldestExpire) {
          oldestExpire = v.expireAt;
          oldestKey = k;
        }
      }
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    this.memoryCache.set(key, {
      value,
      expireAt: Date.now() + (ttl > 0 ? ttl * 1000 : 24 * 60 * 60 * 1000),
    });
  }

  /**
   * 设置缓存值
   */
  async set<T = any>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    const ttl = options?.ttl || this.config.defaultTTL;

    try {
      // 写入内存缓存
      this.setToMemory(key, value, ttl);

      // 写入Redis
      if (this.isRedisAvailable()) {
        const serialized = this.compress(value);
        if (ttl > 0) {
          await this.redis!.setex(key, ttl, serialized);
        } else {
          await this.redis!.set(key, serialized);
        }
        this.stats.writes++;
        this.emit(CacheEvent.WRITE, { key, ttl });
        return true;
      }

      // Redis不可用，使用内存缓存降级
      if (this.config.enableFallback) {
        this.emit(CacheEvent.FALLBACK, { key, reason: 'Redis不可用，使用内存缓存' });
        return true;
      }

      return false;
    } catch (error) {
      console.error(`[CacheManager] Redis SET失败 [${key}]:`, error);
      this.emit(CacheEvent.ERROR, { key, error });

      // 降级：只保存到内存
      if (this.config.enableFallback) {
        this.setToMemory(key, value, ttl);
        return true;
      }
      return false;
    }
  }

  /**
   * 批量获取缓存值
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return [];

    const results: (T | null)[] = [];

    // 先查内存缓存
    const memoryResults = keys.map((key) => {
      const value = this.getFromMemory<T>(key);
      if (value !== null) {
        this.stats.hits++;
        this.stats.memoryHits++;
        return { key, value, found: true };
      }
      return { key, value: null, found: false };
    });

    // 收集未命中的键
    const missKeys: string[] = [];
    const missIndexes: number[] = [];
    memoryResults.forEach((result, index) => {
      if (!result.found) {
        missKeys.push(keys[index]);
        missIndexes.push(index);
        results[index] = null;
      } else {
        results[index] = result.value;
      }
    });

    // 批量查Redis
    if (missKeys.length > 0 && this.isRedisAvailable()) {
      try {
        const redisResults = await this.redis!.mget(...missKeys);
        redisResults.forEach((value, idx) => {
          const index = missIndexes[idx];
          if (value !== null) {
            const data = this.decompress(value);
            results[index] = data as T;
            this.stats.hits++;
            // 同步到内存缓存
            this.setToMemory(keys[index], data, this.config.defaultTTL);
          } else {
            this.stats.misses++;
          }
        });
      } catch (error) {
        console.error('[CacheManager] Redis MGET失败:', error);
        this.emit(CacheEvent.ERROR, { keys: missKeys, error });
      }
    }

    return results;
  }

  /**
   * 批量设置缓存值
   */
  async mset<T = any>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean> {
    if (entries.length === 0) return true;

    try {
      // 写入内存缓存
      entries.forEach(({ key, value, ttl }) => {
        this.setToMemory(key, value, ttl || this.config.defaultTTL);
      });

      // 批量写入Redis
      if (this.isRedisAvailable()) {
        const pipeline = this.redis!.pipeline();
        entries.forEach(({ key, value, ttl }) => {
          const serialized = this.compress(value);
          if (ttl && ttl > 0) {
            pipeline.setex(key, ttl, serialized);
          } else {
            pipeline.set(key, serialized);
          }
        });
        await pipeline.exec();
        this.stats.writes += entries.length;
        return true;
      }

      // Redis不可用，使用内存缓存降级
      if (this.config.enableFallback) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('[CacheManager] Redis MSET失败:', error);
      this.emit(CacheEvent.ERROR, { entries, error });
      return false;
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<boolean> {
    this.memoryCache.delete(key);

    if (this.isRedisAvailable()) {
      try {
        const result = await this.redis!.del(key);
        this.stats.deletes++;
        this.emit(CacheEvent.DELETE, { key });
        return result > 0;
      } catch (error) {
        console.error(`[CacheManager] Redis DEL失败 [${key}]:`, error);
        this.emit(CacheEvent.ERROR, { key, error });
        return false;
      }
    }

    return true;
  }

  /**
   * 批量删除缓存
   */
  async mdel(keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;

    // 删除内存缓存
    keys.forEach((key) => this.memoryCache.delete(key));

    if (this.isRedisAvailable()) {
      try {
        const result = await this.redis!.del(...keys);
        this.stats.deletes += result;
        keys.forEach((key) => this.emit(CacheEvent.DELETE, { key }));
        return result;
      } catch (error) {
        console.error('[CacheManager] Redis DEL批量失败:', error);
        this.emit(CacheEvent.ERROR, { keys, error });
        return 0;
      }
    }

    return keys.length;
  }

  /**
   * 按模式删除缓存
   */
  async delByPattern(pattern: string): Promise<number> {
    if (this.isRedisAvailable()) {
      try {
        const keys = await this.redis!.keys(pattern);
        if (keys.length > 0) {
          const result = await this.redis!.del(...keys);
          // 清理内存缓存
          keys.forEach((key) => {
            const cleanKey = key.replace(this.config.redis.keyPrefix || '', '');
            this.memoryCache.delete(cleanKey);
          });
          this.stats.deletes += result;
          this.emit(CacheEvent.CLEAR, { pattern, count: result });
          return result;
        }
        return 0;
      } catch (error) {
        console.error(`[CacheManager] Redis DEL按模式失败 [${pattern}]:`, error);
        this.emit(CacheEvent.ERROR, { pattern, error });
        return 0;
      }
    }

    // Redis不可用，清理内存缓存中的匹配项
    let count = 0;
    for (const [key] of this.memoryCache) {
      if (key.includes(pattern.replace('*', ''))) {
        this.memoryCache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * 按标签删除缓存
   */
  async delByTag(tag: string): Promise<number> {
    const pattern = `*:${tag}:*`;
    return this.delByPattern(pattern);
  }

  /**
   * 按命名空间删除缓存
   */
  async delByNamespace(namespace: CacheNamespace): Promise<number> {
    const pattern = CacheKeys.namespacePattern(namespace);
    return this.delByPattern(pattern.replace('*', '.*'));
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string): Promise<boolean> {
    // 检查内存缓存
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (item && item.expireAt > Date.now()) {
        return true;
      }
      this.memoryCache.delete(key);
    }

    if (this.isRedisAvailable()) {
      try {
        const result = await this.redis!.exists(key);
        return result > 0;
      } catch (error) {
        console.error(`[CacheManager] Redis EXISTS失败 [${key}]:`, error);
        return false;
      }
    }

    return false;
  }

  /**
   * 获取缓存TTL
   */
  async getTTL(key: string): Promise<number> {
    if (this.isRedisAvailable()) {
      try {
        const ttl = await this.redis!.ttl(key);
        return ttl;
      } catch (error) {
        console.error(`[CacheManager] Redis TTL失败 [${key}]:`, error);
        return -2;
      }
    }
    return -2;
  }

  /**
   * 刷新缓存TTL
   */
  async refreshTTL(key: string, ttl?: number): Promise<boolean> {
    const newTTL = ttl || this.config.defaultTTL;
    if (newTTL <= 0) return true;

    if (this.isRedisAvailable()) {
      try {
        await this.redis!.expire(key, newTTL);
        return true;
      } catch (error) {
        console.error(`[CacheManager] Redis EXPIRE失败 [${key}]:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * 清空所有缓存
   */
  async clearAll(): Promise<boolean> {
    this.memoryCache.clear();

    if (this.isRedisAvailable()) {
      try {
        await this.redis!.flushdb();
        this.emit(CacheEvent.CLEAR, { all: true });
        return true;
      } catch (error) {
        console.error('[CacheManager] Redis FLUSHDB失败:', error);
        this.emit(CacheEvent.ERROR, { error });
        return false;
      }
    }
    return true;
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    this.stats.hitRate = this.stats.totalRequests > 0
      ? this.stats.hits / this.stats.totalRequests
      : 0;
    this.stats.memorySize = this.memoryCache.size;
    return { ...this.stats };
  }

  /**
   * 重置缓存统计信息
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      writes: 0,
      deletes: 0,
      memoryHits: 0,
      memorySize: 0,
    };
  }

  /**
   * 获取Redis客户端实例（用于高级操作）
   */
  getRedisClient(): Redis | null {
    return this.redis;
  }

  /**
   * 关闭缓存管理器
   */
  async close(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }

    this.memoryCache.clear();
    this.isConnected = false;
    console.log('[CacheManager] 缓存管理器已关闭');
  }
}

/**
 * 创建缓存管理器实例（工厂函数）
 */
export function createCacheManager(config: CacheConfig): CacheManager {
  return new CacheManager(config);
}

export default CacheManager;