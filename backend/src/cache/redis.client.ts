/**
 * Redis客户端配置
 * 支持单机、哨兵、集群模式，包含连接池、重连、健康检查
 * @module redis.client
 */

import Redis, { RedisOptions, Cluster, ClusterOptions } from 'ioredis';
import { EventEmitter } from 'events';

/**
 * Redis连接模式
 */
export enum RedisMode {
  /** 单机模式 */
  SINGLE = 'single',
  /** 哨兵模式 */
  SENTINEL = 'sentinel',
  /** 集群模式 */
  CLUSTER = 'cluster',
}

/**
 * Redis配置接口
 */
export interface RedisConfig {
  /** 连接模式 */
  mode?: RedisMode;
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
  /** 通用配置 */
  options?: {
    keyPrefix?: string;
    connectTimeout?: number;
    commandTimeout?: number;
    retryStrategy?: (times: number) => number;
    maxRetriesPerRequest?: number;
    enableReadyCheck?: boolean;
    lazyConnect?: boolean;
    keepAlive?: number;
    maxReconnectAttempts?: number;
  };
  /** 连接池配置 */
  pool?: {
    minSize?: number;
    maxSize?: number;
    idleTimeout?: number;
  };
}

/**
 * Redis客户端状态
 */
export enum RedisStatus {
  /** 未连接 */
  DISCONNECTED = 'disconnected',
  /** 连接中 */
  CONNECTING = 'connecting',
  /** 已连接 */
  CONNECTED = 'connected',
  /** 错误 */
  ERROR = 'error',
  /** 关闭 */
  CLOSED = 'closed',
}

/**
 * Redis客户端事件
 */
export enum RedisClientEvent {
  CONNECT = 'connect',
  READY = 'ready',
  CLOSE = 'close',
  ERROR = 'error',
  RECONNECT = 'reconnect',
  RECONNECT_FAILED = 'reconnect_failed',
  STATUS_CHANGE = 'status_change',
}

/**
 * Redis健康检查结果
 */
export interface RedisHealthResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  latency: number;
  info: {
    version: string;
    uptime: number;
    connectedClients: number;
    usedMemory: number;
    totalCommands: number;
  };
  error?: string;
}

/**
 * 企业级Redis客户端
 */
export class RedisClient extends EventEmitter {
  private client: Redis | Cluster | null = null;
  private config: RedisConfig;
  private status: RedisStatus = RedisStatus.DISCONNECTED;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isShuttingDown = false;
  private commandQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    command: string;
    args: any[];
    timestamp: number;
  }> = [];
  private isProcessingQueue = false;

  constructor(config: RedisConfig) {
    super();
    this.config = {
      mode: RedisMode.SINGLE,
      options: {
        keyPrefix: 'bai:erp:',
        connectTimeout: 10000,
        commandTimeout: 5000,
        enableReadyCheck: true,
        lazyConnect: false,
        keepAlive: 30000,
        maxRetriesPerRequest: 3,
      },
      pool: {
        minSize: 2,
        maxSize: 20,
        idleTimeout: 60000,
      },
      ...config,
    };

    this.maxReconnectAttempts = this.config.options?.maxReconnectAttempts || 10;
    this.initialize();
  }

  /**
   * 初始化Redis客户端
   */
  private initialize(): void {
    this.setStatus(RedisStatus.CONNECTING);

    try {
      switch (this.config.mode) {
        case RedisMode.SENTINEL:
          this.client = this.createSentinelClient();
          break;
        case RedisMode.CLUSTER:
          this.client = this.createClusterClient();
          break;
        default:
          this.client = this.createSingleClient();
      }

      this.bindEvents();
      this.startHealthCheck();
      this.startHeartbeat();

      console.log('[RedisClient] 初始化完成');
    } catch (error) {
      console.error('[RedisClient] 初始化失败:', error);
      this.setStatus(RedisStatus.ERROR);
      this.emit(RedisClientEvent.ERROR, error);
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

    const options: RedisOptions = {
      host,
      port,
      password,
      db: db || 0,
      ...this.config.options,
      retryStrategy: this.createRetryStrategy(),
    };

    return new Redis(options);
  }

  /**
   * 创建哨兵客户端
   */
  private createSentinelClient(): Redis {
    const { hosts, name, password, db, sentinelPassword } = this.config.sentinel || {
      hosts: [{ host: 'localhost', port: 26379 }],
      name: 'mymaster',
    };

    const options: RedisOptions = {
      sentinels: hosts,
      name,
      password,
      db: db || 0,
      sentinelPassword,
      ...this.config.options,
      retryStrategy: this.createRetryStrategy(),
    };

    return new Redis(options);
  }

  /**
   * 创建集群客户端
   */
  private createClusterClient(): Cluster {
    const { hosts, password, maxRedirections } = this.config.cluster || {
      hosts: [{ host: 'localhost', port: 7000 }],
    };

    const options: ClusterOptions = {
      redisOptions: {
        password,
        ...this.config.options,
        retryStrategy: this.createRetryStrategy(),
      },
      maxRedirections: maxRedirections || 3,
      clusterRetryStrategy: this.createClusterRetryStrategy(),
    };

    return new Cluster(hosts, options);
  }

  /**
   * 创建重试策略
   */
  private createRetryStrategy(): (times: number) => number | null {
    return (times: number): number | null => {
      if (this.isShuttingDown) {
        return null;
      }

      this.reconnectAttempts = times;

      if (times > this.maxReconnectAttempts) {
        console.error(`[RedisClient] 重连失败次数超过限制 (${this.maxReconnectAttempts})`);
        this.emit(RedisClientEvent.RECONNECT_FAILED, { attempts: times });
        this.setStatus(RedisStatus.ERROR);
        return null;
      }

      const delay = Math.min(Math.pow(2, Math.min(times, 10)) * 100, 3000);
      console.log(`[RedisClient] 第 ${times} 次重连，延迟 ${delay}ms`);
      this.emit(RedisClientEvent.RECONNECT, { attempts: times, delay });
      return delay;
    };
  }

  /**
   * 创建集群重试策略
   */
  private createClusterRetryStrategy(): (times: number) => number | null {
    return (times: number): number | null => {
      if (this.isShuttingDown || times > this.maxReconnectAttempts) {
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
      console.log('[RedisClient] 连接成功');
      this.reconnectAttempts = 0;
      this.setStatus(RedisStatus.CONNECTED);
      this.emit(RedisClientEvent.CONNECT);
      this.processCommandQueue();
    });

    this.client.on('ready', () => {
      console.log('[RedisClient] 就绪');
      this.emit(RedisClientEvent.READY);
    });

    this.client.on('close', () => {
      console.log('[RedisClient] 连接关闭');
      if (!this.isShuttingDown) {
        this.setStatus(RedisStatus.DISCONNECTED);
      } else {
        this.setStatus(RedisStatus.CLOSED);
      }
      this.emit(RedisClientEvent.CLOSE);
    });

    this.client.on('error', (error) => {
      console.error('[RedisClient] 错误:', error);
      this.emit(RedisClientEvent.ERROR, error);
      if (this.status === RedisStatus.CONNECTED) {
        this.setStatus(RedisStatus.ERROR);
      }
    });

    this.client.on('reconnecting', (delay) => {
      console.log(`[RedisClient] 重连中 (${this.reconnectAttempts}): ${delay}ms`);
      this.setStatus(RedisStatus.CONNECTING);
    });
  }

  /**
   * 设置状态
   */
  private setStatus(status: RedisStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit(RedisClientEvent.STATUS_CHANGE, { previous: this.status, current: status });
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
      if (this.status === RedisStatus.CONNECTED || this.status === RedisStatus.CONNECTING) {
        try {
          await this.healthCheck();
        } catch (error) {
          // 健康检查失败，但不需要额外处理
        }
      }
    }, 30000); // 30秒检查一次
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(async () => {
      if (this.status === RedisStatus.CONNECTED && this.client) {
        try {
          await this.client.ping();
        } catch (error) {
          console.warn('[RedisClient] 心跳失败:', error);
        }
      }
    }, 10000); // 10秒一次
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<RedisHealthResult> {
    const startTime = Date.now();

    try {
      if (!this.client) {
        throw new Error('Redis客户端未初始化');
      }

      const pingResult = await this.client.ping();
      const latency = Date.now() - startTime;

      if (pingResult !== 'PONG') {
        throw new Error('Ping失败');
      }

      // 获取Redis信息
      const info = await this.client.info();
      const infoLines = info.split('\n');
      const infoData: Record<string, string> = {};

      infoLines.forEach((line) => {
        const [key, value] = line.split(':');
        if (key && value) {
          infoData[key.trim()] = value.trim();
        }
      });

      return {
        status: latency < 100 ? 'healthy' : 'degraded',
        latency,
        info: {
          version: infoData['redis_version'] || 'unknown',
          uptime: parseInt(infoData['uptime_in_seconds'] || '0'),
          connectedClients: parseInt(infoData['connected_clients'] || '0'),
          usedMemory: parseInt(infoData['used_memory'] || '0'),
          totalCommands: parseInt(infoData['total_commands_processed'] || '0'),
        },
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        info: {
          version: 'unknown',
          uptime: 0,
          connectedClients: 0,
          usedMemory: 0,
          totalCommands: 0,
        },
        error: error.message,
      };
    }
  }

  /**
   * 处理命令队列
   */
  private async processCommandQueue(): Promise<void> {
    if (this.isProcessingQueue || this.commandQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.commandQueue.length > 0) {
      const item = this.commandQueue.shift();
      if (!item) continue;

      try {
        const result = await this.executeCommand(item.command, item.args);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * 执行命令
   */
  private async executeCommand(command: string, args: any[]): Promise<any> {
    if (!this.client) {
      throw new Error('Redis客户端未初始化');
    }

    return (this.client as any)[command](...args);
  }

  /**
   * 执行Redis命令（带队列缓冲）
   */
  async execute<T = any>(command: string, ...args: any[]): Promise<T> {
    if (this.status === RedisStatus.CONNECTED && this.client) {
      try {
        return await this.executeCommand(command, args);
      } catch (error) {
        // 如果命令失败，尝试加入队列
        return new Promise((resolve, reject) => {
          this.commandQueue.push({
            resolve,
            reject,
            command,
            args,
            timestamp: Date.now(),
          });
          this.processCommandQueue();
        });
      }
    }

    // 未连接时入队
    return new Promise((resolve, reject) => {
      this.commandQueue.push({
        resolve,
        reject,
        command,
        args,
        timestamp: Date.now(),
      });

      // 如果队列过长，清理旧命令
      if (this.commandQueue.length > 1000) {
        const removed = this.commandQueue.splice(0, 100);
        removed.forEach((item) => {
          item.reject(new Error('Redis命令队列溢出'));
        });
      }

      this.processCommandQueue();
    });
  }

  /**
   * 获取Redis客户端实例
   */
  getClient(): Redis | Cluster | null {
    return this.client;
  }

  /**
   * 获取当前状态
   */
  getStatus(): RedisStatus {
    return this.status;
  }

  /**
   * 检查是否连接
   */
  isConnected(): boolean {
    return this.status === RedisStatus.CONNECTED;
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo(): Record<string, any> {
    const info: Record<string, any> = {
      mode: this.config.mode,
      status: this.status,
      reconnectAttempts: this.reconnectAttempts,
      queueSize: this.commandQueue.length,
      isShuttingDown: this.isShuttingDown,
    };

    if (this.config.single) {
      info.host = this.config.single.host;
      info.port = this.config.single.port;
    }

    return info;
  }

  /**
   * 关闭连接
   */
  async close(force = false): Promise<void> {
    this.isShuttingDown = true;

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.client) {
      try {
        if (force) {
          await this.client.disconnect();
        } else {
          await this.client.quit();
        }
        console.log('[RedisClient] 连接已关闭');
      } catch (error) {
        console.error('[RedisClient] 关闭连接失败:', error);
      }
      this.client = null;
    }

    // 拒绝所有待处理命令
    this.commandQueue.forEach((item) => {
      item.reject(new Error('Redis连接已关闭'));
    });
    this.commandQueue = [];

    this.setStatus(RedisStatus.CLOSED);
  }

  /**
   * 重连
   */
  async reconnect(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    if (this.client) {
      await this.close(true);
    }

    this.reconnectAttempts = 0;
    this.initialize();
  }

  /**
   * 获取连接池状态
   */
  getPoolStats(): Record<string, any> {
    const pool = this.config.pool || { minSize: 2, maxSize: 20 };
    return {
      minSize: pool.minSize,
      maxSize: pool.maxSize,
      idleTimeout: pool.idleTimeout,
      currentCommands: this.commandQueue.length,
    };
  }
}

/**
 * 创建Redis客户端实例（工厂函数）
 */
export function createRedisClient(config: RedisConfig): RedisClient {
  return new RedisClient(config);
}

/**
 * 从环境变量创建Redis客户端
 */
export function createRedisClientFromEnv(): RedisClient {
  const config: RedisConfig = {
    mode: (process.env.REDIS_MODE as RedisMode) || RedisMode.SINGLE,
    options: {
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'bai:erp:',
      connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
      commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),
      maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
    },
  };

  if (config.mode === RedisMode.SINGLE) {
    config.single = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
    };
  } else if (config.mode === RedisMode.SENTINEL) {
    const sentinelHosts = (process.env.REDIS_SENTINEL_HOSTS || 'localhost:26379').split(',');
    config.sentinel = {
      hosts: sentinelHosts.map((host) => {
        const [h, p] = host.split(':');
        return { host: h, port: parseInt(p || '26379') };
      }),
      name: process.env.REDIS_SENTINEL_NAME || 'mymaster',
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD || undefined,
    };
  } else if (config.mode === RedisMode.CLUSTER) {
    const clusterHosts = (process.env.REDIS_CLUSTER_HOSTS || 'localhost:7000').split(',');
    config.cluster = {
      hosts: clusterHosts.map((host) => {
        const [h, p] = host.split(':');
        return { host: h, port: parseInt(p || '7000') };
      }),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRedirections: parseInt(process.env.REDIS_MAX_REDIRECTIONS || '3'),
    };
  }

  return new RedisClient(config);
}

export default RedisClient;