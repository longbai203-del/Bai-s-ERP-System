/**
 * 队列Redis配置
 * 完整的Redis连接配置，支持单机、哨兵、集群
 * @module redis.config
 */

import Redis from 'ioredis';
import { EventEmitter } from 'events';

/**
 * Redis连接模式
 */
export enum QueueRedisMode {
  SINGLE = 'single',
  SENTINEL = 'sentinel',
  CLUSTER = 'cluster',
}

/**
 * Redis配置接口
 */
export interface QueueRedisConfig {
  /** 连接模式 */
  mode?: QueueRedisMode;
  /** 单机配置 */
  single?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  /** 哨兵配置 */
  sentinel?: {
    hosts: Array<{ host: string; port: number }>;
    name: string;
    password?: string;
    db?: number;
    sentinelPassword?: string;
  };
  /** 集群配置 */
  cluster?: {
    hosts: Array<{ host: string; port: number }>;
    password?: string;
    maxRedirections?: number;
  };
  /** 通用选项 */
  options?: {
    keyPrefix?: string;
    connectTimeout?: number;
    commandTimeout?: number;
    retryStrategy?: (times: number) => number;
    maxRetriesPerRequest?: number;
    enableReadyCheck?: boolean;
    lazyConnect?: boolean;
    keepAlive?: number;
  };
}

/**
 * Redis连接状态
 */
export enum QueueRedisStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
  CLOSED = 'closed',
}

/**
 * 队列Redis客户端
 */
export class QueueRedisClient extends EventEmitter {
  private client: Redis | null = null;
  private config: QueueRedisConfig;
  private status: QueueRedisStatus = QueueRedisStatus.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor(config: QueueRedisConfig) {
    super();
    this.config = {
      mode: QueueRedisMode.SINGLE,
      options: {
        keyPrefix: 'bai:erp:queue:',
        connectTimeout: 10000,
        commandTimeout: 5000,
        enableReadyCheck: true,
        lazyConnect: false,
        keepAlive: 30000,
        maxRetriesPerRequest: 3,
      },
      ...config,
    };

    this.initialize();
  }

  /**
   * 初始化Redis客户端
   */
  private initialize(): void {
    this.setStatus(QueueRedisStatus.CONNECTING);

    try {
      switch (this.config.mode) {
        case QueueRedisMode.SENTINEL:
          this.client = this.createSentinelClient();
          break;
        case QueueRedisMode.CLUSTER:
          this.client = this.createClusterClient();
          break;
        default:
          this.client = this.createSingleClient();
      }

      this.bindEvents();
      this.startHealthCheck();

      console.log('[QueueRedis] 初始化完成');
    } catch (error) {
      console.error('[QueueRedis] 初始化失败:', error);
      this.setStatus(QueueRedisStatus.ERROR);
      this.emit('error', error);
    }
  }

  /**
   * 创建单机客户端
   */
  private createSingleClient(): Redis {
    const { host, port, password, db } = this.config.single || {
      host: 'localhost',
      port: 6379,
    };

    return new Redis({
      host,
      port,
      password,
      db: db || 0,
      ...this.config.options,
      retryStrategy: this.createRetryStrategy(),
    });
  }

  /**
   * 创建哨兵客户端
   */
  private createSentinelClient(): Redis {
    const { hosts, name, password, db, sentinelPassword } = this.config.sentinel || {
      hosts: [{ host: 'localhost', port: 26379 }],
      name: 'mymaster',
    };

    return new Redis({
      sentinels: hosts,
      name,
      password,
      db: db || 0,
      sentinelPassword,
      ...this.config.options,
      retryStrategy: this.createRetryStrategy(),
    });
  }

  /**
   * 创建集群客户端
   */
  private createClusterClient(): Redis {
    const { hosts, password, maxRedirections } = this.config.cluster || {
      hosts: [{ host: 'localhost', port: 7000 }],
    };

    return new Redis.Cluster(hosts, {
      redisOptions: {
        password,
        ...this.config.options,
        retryStrategy: this.createRetryStrategy(),
      },
      maxRedirections: maxRedirections || 3,
      clusterRetryStrategy: this.createClusterRetryStrategy(),
    });
  }

  /**
   * 创建重试策略
   */
  private createRetryStrategy(): (times: number) => number | null {
    return (times: number): number | null => {
      this.reconnectAttempts = times;

      if (times > this.maxReconnectAttempts) {
        console.error(`[QueueRedis] 重连失败次数超过限制 (${this.maxReconnectAttempts})`);
        this.emit('reconnect_failed', { attempts: times });
        this.setStatus(QueueRedisStatus.ERROR);
        return null;
      }

      const delay = Math.min(Math.pow(2, Math.min(times, 10)) * 100, 3000);
      console.log(`[QueueRedis] 第 ${times} 次重连，延迟 ${delay}ms`);
      this.emit('reconnecting', { attempts: times, delay });
      return delay;
    };
  }

  /**
   * 创建集群重试策略
   */
  private createClusterRetryStrategy(): (times: number) => number | null {
    return (times: number): number | null => {
      if (times > this.maxReconnectAttempts) {
        return null;
      }
      return Math.min(times * 100, 3000);
    };
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('[QueueRedis] 连接成功');
      this.reconnectAttempts = 0;
      this.setStatus(QueueRedisStatus.CONNECTED);
      this.emit('connect');
    });

    this.client.on('ready', () => {
      console.log('[QueueRedis] 就绪');
      this.emit('ready');
    });

    this.client.on('close', () => {
      console.log('[QueueRedis] 连接关闭');
      this.setStatus(QueueRedisStatus.DISCONNECTED);
      this.emit('close');
    });

    this.client.on('error', (error) => {
      console.error('[QueueRedis] 错误:', error);
      this.emit('error', error);
      if (this.status === QueueRedisStatus.CONNECTED) {
        this.setStatus(QueueRedisStatus.ERROR);
      }
    });

    this.client.on('reconnecting', (delay) => {
      console.log(`[QueueRedis] 重连中 (${this.reconnectAttempts}): ${delay}ms`);
      this.setStatus(QueueRedisStatus.CONNECTING);
    });
  }

  /**
   * 设置状态
   */
  private setStatus(status: QueueRedisStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit('status_change', { previous: this.status, current: status });
    }
  }

  /**
   * 启动健康检查
   */
  private startHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(async () => {
      if (this.status === QueueRedisStatus.CONNECTED && this.client) {
        try {
          await this.client.ping();
        } catch (error) {
          console.warn('[QueueRedis] 健康检查失败:', error);
        }
      }
    }, 30000);
  }

  /**
   * 获取Redis客户端
   */
  getClient(): Redis | null {
    return this.client;
  }

  /**
   * 获取状态
   */
  getStatus(): QueueRedisStatus {
    return this.status;
  }

  /**
   * 检查是否连接
   */
  isConnected(): boolean {
    return this.status === QueueRedisStatus.CONNECTED;
  }

  /**
   * 关闭连接
   */
  async close(): Promise<void> {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    if (this.client) {
      try {
        await this.client.quit();
        console.log('[QueueRedis] 连接已关闭');
      } catch (error) {
        console.error('[QueueRedis] 关闭连接失败:', error);
      }
      this.client = null;
    }

    this.setStatus(QueueRedisStatus.CLOSED);
  }

  /**
   * 重连
   */
  async reconnect(): Promise<void> {
    if (this.client) {
      await this.close();
    }

    this.reconnectAttempts = 0;
    this.initialize();
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo(): Record<string, any> {
    const info: Record<string, any> = {
      mode: this.config.mode,
      status: this.status,
      reconnectAttempts: this.reconnectAttempts,
    };

    if (this.config.single) {
      info.host = this.config.single.host;
      info.port = this.config.single.port;
    }

    return info;
  }
}

/**
 * 创建队列Redis客户端（工厂函数）
 */
export function createQueueRedisClient(config: QueueRedisConfig): QueueRedisClient {
  return new QueueRedisClient(config);
}

/**
 * 从环境变量创建配置
 */
export function createQueueRedisFromEnv(): QueueRedisClient {
  const config: QueueRedisConfig = {
    mode: (process.env.QUEUE_REDIS_MODE as QueueRedisMode) || QueueRedisMode.SINGLE,
    options: {
      keyPrefix: process.env.QUEUE_REDIS_PREFIX || 'bai:erp:queue:',
      connectTimeout: parseInt(process.env.QUEUE_REDIS_CONNECT_TIMEOUT || '10000'),
      commandTimeout: parseInt(process.env.QUEUE_REDIS_COMMAND_TIMEOUT || '5000'),
      maxRetriesPerRequest: parseInt(process.env.QUEUE_REDIS_MAX_RETRIES || '3'),
    },
  };

  if (config.mode === QueueRedisMode.SINGLE) {
    config.single = {
      host: process.env.QUEUE_REDIS_HOST || 'localhost',
      port: parseInt(process.env.QUEUE_REDIS_PORT || '6379'),
      password: process.env.QUEUE_REDIS_PASSWORD || undefined,
      db: parseInt(process.env.QUEUE_REDIS_DB || '1'),
    };
  } else if (config.mode === QueueRedisMode.SENTINEL) {
    const sentinelHosts = (process.env.QUEUE_REDIS_SENTINEL_HOSTS || 'localhost:26379').split(',');
    config.sentinel = {
      hosts: sentinelHosts.map((host) => {
        const [h, p] = host.split(':');
        return { host: h, port: parseInt(p || '26379') };
      }),
      name: process.env.QUEUE_REDIS_SENTINEL_NAME || 'mymaster',
      password: process.env.QUEUE_REDIS_PASSWORD || undefined,
      db: parseInt(process.env.QUEUE_REDIS_DB || '1'),
      sentinelPassword: process.env.QUEUE_REDIS_SENTINEL_PASSWORD || undefined,
    };
  } else if (config.mode === QueueRedisMode.CLUSTER) {
    const clusterHosts = (process.env.QUEUE_REDIS_CLUSTER_HOSTS || 'localhost:7000').split(',');
    config.cluster = {
      hosts: clusterHosts.map((host) => {
        const [h, p] = host.split(':');
        return { host: h, port: parseInt(p || '7000') };
      }),
      password: process.env.QUEUE_REDIS_PASSWORD || undefined,
      maxRedirections: parseInt(process.env.QUEUE_REDIS_MAX_REDIRECTIONS || '3'),
    };
  }

  return new QueueRedisClient(config);
}

export default QueueRedisClient;