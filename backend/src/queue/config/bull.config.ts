/**
 * Bull队列配置
 * 完整队列配置，支持重试、优先级、延迟、事件监听
 * @module bull.config
 */

import { QueueOptions, WorkerOptions } from 'bullmq';
import Redis from 'ioredis';

/**
 * Bull队列配置接口
 */
export interface BullConfig {
  /** 连接配置 */
  connection: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  /** 队列配置 */
  queue: {
    /** 队列名称前缀 */
    prefix?: string;
    /** 默认TTL */
    defaultJobOptions?: {
      attempts?: number;
      backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
      };
      removeOnComplete?: boolean | number;
      removeOnFail?: boolean | number;
      timeout?: number;
    };
  };
  /** Worker配置 */
  worker: {
    /** 并发数 */
    concurrency?: number;
    /** 最大并发数 */
    maxConcurrency?: number;
    /** 优先级 */
    priority?: number;
    /** 退出超时 */
    drainDelay?: number;
    /** 是否自动启动 */
    autorun?: boolean;
  };
}

/**
 * 默认Bull配置
 */
export const DEFAULT_BULL_CONFIG: BullConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '1'),
  },
  queue: {
    prefix: 'bai:erp:queue',
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 200,
      timeout: 30000,
    },
  },
  worker: {
    concurrency: 10,
    maxConcurrency: 20,
    priority: 0,
    drainDelay: 1000,
    autorun: true,
  },
};

/**
 * 队列名称常量
 */
export enum QueueNames {
  /** 邮件队列 */
  EMAIL = 'email',
  /** 通知队列 */
  NOTIFICATION = 'notification',
  /** 报告队列 */
  REPORT = 'report',
  /** 导入队列 */
  IMPORT = 'import',
  /** 导出队列 */
  EXPORT = 'export',
  /** 清理队列 */
  CLEANUP = 'cleanup',
  /** 审计队列 */
  AUDIT = 'audit',
  /** 备份队列 */
  BACKUP = 'backup',
  /** 分析队列 */
  ANALYTICS = 'analytics',
  /** 同步队列 */
  SYNC = 'sync',
}

/**
 * Bull队列配置管理器
 */
export class BullConfigManager {
  private config: BullConfig;

  constructor(config: Partial<BullConfig> = {}) {
    this.config = {
      connection: { ...DEFAULT_BULL_CONFIG.connection },
      queue: { ...DEFAULT_BULL_CONFIG.queue },
      worker: { ...DEFAULT_BULL_CONFIG.worker },
      ...config,
    };
  }

  /**
   * 获取Redis连接配置
   */
  getRedisOptions(): Redis.RedisOptions {
    return {
      host: this.config.connection.host,
      port: this.config.connection.port,
      password: this.config.connection.password,
      db: this.config.connection.db,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
      keepAlive: 30000,
    };
  }

  /**
   * 获取队列配置
   */
  getQueueOptions(): QueueOptions {
    return {
      connection: this.getRedisOptions(),
      prefix: this.config.queue.prefix,
      defaultJobOptions: {
        attempts: this.config.queue.defaultJobOptions?.attempts || 3,
        backoff: this.config.queue.defaultJobOptions?.backoff || {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: this.config.queue.defaultJobOptions?.removeOnComplete || 100,
        removeOnFail: this.config.queue.defaultJobOptions?.removeOnFail || 200,
        timeout: this.config.queue.defaultJobOptions?.timeout || 30000,
      },
    };
  }

  /**
   * 获取Worker配置
   */
  getWorkerOptions(): WorkerOptions {
    return {
      connection: this.getRedisOptions(),
      concurrency: this.config.worker.concurrency || 10,
      maxConcurrency: this.config.worker.maxConcurrency || 20,
      priority: this.config.worker.priority || 0,
      drainDelay: this.config.worker.drainDelay || 1000,
      autorun: this.config.worker.autorun !== false,
      removeOnComplete: {
        age: 3600, // 保留1小时
        count: 100,
      },
      removeOnFail: {
        age: 86400, // 保留24小时
        count: 200,
      },
    };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<BullConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      connection: { ...this.config.connection, ...config.connection },
      queue: { ...this.config.queue, ...config.queue },
      worker: { ...this.config.worker, ...config.worker },
    };
  }

  /**
   * 获取完整配置
   */
  getConfig(): BullConfig {
    return { ...this.config };
  }

  /**
   * 获取特定队列的配置
   */
  getQueueConfig(queueName: QueueNames): {
    queueOptions: QueueOptions;
    workerOptions: WorkerOptions;
  } {
    const queueOptions = this.getQueueOptions();
    const workerOptions = this.getWorkerOptions();

    // 为不同队列定制配置
    switch (queueName) {
      case QueueNames.EMAIL:
        workerOptions.concurrency = 5;
        workerOptions.maxConcurrency = 10;
        queueOptions.defaultJobOptions!.attempts = 5;
        queueOptions.defaultJobOptions!.timeout = 60000;
        break;
      case QueueNames.REPORT:
        workerOptions.concurrency = 2;
        workerOptions.maxConcurrency = 5;
        queueOptions.defaultJobOptions!.timeout = 300000;
        break;
      case QueueNames.IMPORT:
        workerOptions.concurrency = 1;
        workerOptions.maxConcurrency = 3;
        queueOptions.defaultJobOptions!.timeout = 600000;
        break;
      case QueueNames.EXPORT:
        workerOptions.concurrency = 2;
        workerOptions.maxConcurrency = 5;
        queueOptions.defaultJobOptions!.timeout = 180000;
        break;
      case QueueNames.AUDIT:
        workerOptions.concurrency = 10;
        workerOptions.maxConcurrency = 20;
        queueOptions.defaultJobOptions!.attempts = 2;
        break;
      default:
        break;
    }

    return { queueOptions, workerOptions };
  }

  /**
   * 从环境变量创建配置
   */
  static fromEnv(): BullConfigManager {
    const config: BullConfig = {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_QUEUE_DB || '1'),
      },
      queue: {
        prefix: process.env.QUEUE_PREFIX || 'bai:erp:queue',
        defaultJobOptions: {
          attempts: parseInt(process.env.QUEUE_ATTEMPTS || '3'),
          backoff: {
            type: (process.env.QUEUE_BACKOFF_TYPE as 'fixed' | 'exponential') || 'exponential',
            delay: parseInt(process.env.QUEUE_BACKOFF_DELAY || '1000'),
          },
          removeOnComplete: parseInt(process.env.QUEUE_REMOVE_COMPLETE || '100'),
          removeOnFail: parseInt(process.env.QUEUE_REMOVE_FAIL || '200'),
          timeout: parseInt(process.env.QUEUE_TIMEOUT || '30000'),
        },
      },
      worker: {
        concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '10'),
        maxConcurrency: parseInt(process.env.QUEUE_MAX_CONCURRENCY || '20'),
        priority: parseInt(process.env.QUEUE_PRIORITY || '0'),
        drainDelay: parseInt(process.env.QUEUE_DRAIN_DELAY || '1000'),
        autorun: process.env.QUEUE_AUTORUN !== 'false',
      },
    };

    return new BullConfigManager(config);
  }
}

/**
 * 创建Bull配置管理器（工厂函数）
 */
export function createBullConfig(config?: Partial<BullConfig>): BullConfigManager {
  return new BullConfigManager(config);
}

/**
 * 默认配置管理器实例
 */
export const defaultBullConfig = BullConfigManager.fromEnv();

export default BullConfigManager;