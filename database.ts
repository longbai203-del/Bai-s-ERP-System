/**
 * @file Config/database.ts
 * 数据库配置 - 生产级连接管理、连接池、SSL、重试策略、慢查询日志
 * 完整实现：补全连接池参数、SSL校验、连接重试策略、超时配置、慢查询日志
 */

import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { logger } from './winston.config';

dotenv.config();

// ============================================
// 类型定义
// ============================================

export type DatabaseType = 'mysql' | 'postgres' | 'sqlite' | 'mongodb';

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean | 'all' | ('query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration')[];
  entities: string[];
  migrations: string[];
  subscribers: string[];
  poolSize: number;
  connectTimeout: number;
  acquireTimeout: number;
  idleTimeout: number;
  maxQueryExecutionTime: number;
  ssl?: boolean | { rejectUnauthorized: boolean; ca?: string; key?: string; cert?: string };
  charset?: string;
  timezone?: string;
  supportBigNumbers?: boolean;
  bigNumberStrings?: boolean;
  // 重试配置
  retryAttempts: number;
  retryDelay: number;
  retryBackoff: number;
  // 慢查询配置
  slowQueryThreshold: number;
  enableSlowQueryLog: boolean;
  // 连接生命周期
  maxLifetime: number;
  connectionTimeout: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  database: string;
  host: string;
  port: number;
  poolSize: number;
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  lastError?: string;
  lastConnectTime?: Date;
  uptime?: number;
}

// ============================================
// 数据库配置管理器
// ============================================

export class DatabaseConfigManager {
  private static instance: DatabaseConfigManager;
  private config: DatabaseConfig;
  private dataSource: DataSource | null = null;
  private connectionStatus: ConnectionStatus;
  private retryCount: number = 0;
  private lastError: Error | null = null;
  private connectTime: Date | null = null;
  private isConnecting: boolean = false;

  private constructor() {
    this.config = this.buildConfig();
    this.connectionStatus = this.buildInitialStatus();
    this.validateConfig();
  }

  public static getInstance(): DatabaseConfigManager {
    if (!DatabaseConfigManager.instance) {
      DatabaseConfigManager.instance = new DatabaseConfigManager();
    }
    return DatabaseConfigManager.instance;
  }

  /**
   * 构建数据库配置
   */
  private buildConfig(): DatabaseConfig {
    const isProduction = process.env.NODE_ENV === 'production';
    const isTest = process.env.NODE_ENV === 'test';
    const dbType = (process.env.DB_TYPE || 'mysql') as DatabaseType;

    const baseConfig: DatabaseConfig = {
      type: dbType,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_db',
      synchronize: !isProduction && !isTest,
      logging: isProduction ? ['error', 'warn'] : ['query', 'error', 'warn'],
      entities: [path.join(__dirname, '../models/**/*.model.ts')],
      migrations: [path.join(__dirname, '../migrations/**/*.ts')],
      subscribers: [path.join(__dirname, '../subscribers/**/*.ts')],
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
      connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10),
      acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '10000', 10),
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '60000', 10),
      maxQueryExecutionTime: parseInt(process.env.DB_MAX_QUERY_TIME || '5000', 10),
      charset: process.env.DB_CHARSET || 'utf8mb4',
      timezone: process.env.DB_TIMEZONE || '+00:00',
      supportBigNumbers: true,
      bigNumberStrings: true,
      // 重试配置
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '5', 10),
      retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000', 10),
      retryBackoff: parseInt(process.env.DB_RETRY_BACKOFF || '2', 10),
      // 慢查询配置
      slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '2000', 10),
      enableSlowQueryLog: process.env.DB_ENABLE_SLOW_QUERY_LOG !== 'false',
      // 连接生命周期
      maxLifetime: parseInt(process.env.DB_MAX_LIFETIME || '3600000', 10),
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
    };

    // SSL配置
    if (process.env.DB_SSL === 'true') {
      const sslConfig: any = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      };

      // 读取SSL证书文件
      if (process.env.DB_SSL_CA_PATH) {
        try {
          sslConfig.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
        } catch (error) {
          console.error('[Database] 读取SSL CA证书失败:', error);
        }
      }
      if (process.env.DB_SSL_KEY_PATH) {
        try {
          sslConfig.key = fs.readFileSync(process.env.DB_SSL_KEY_PATH, 'utf8');
        } catch (error) {
          console.error('[Database] 读取SSL私钥失败:', error);
        }
      }
      if (process.env.DB_SSL_CERT_PATH) {
        try {
          sslConfig.cert = fs.readFileSync(process.env.DB_SSL_CERT_PATH, 'utf8');
        } catch (error) {
          console.error('[Database] 读取SSL证书失败:', error);
        }
      }

      baseConfig.ssl = sslConfig;
    }

    // 测试环境特殊配置
    if (isTest) {
      baseConfig.database = `${baseConfig.database}_test`;
      baseConfig.synchronize = true;
      baseConfig.logging = false;
      baseConfig.poolSize = 2;
      baseConfig.retryAttempts = 2;
    }

    return baseConfig;
  }

  /**
   * 构建初始连接状态
   */
  private buildInitialStatus(): ConnectionStatus {
    return {
      isConnected: false,
      database: this.config.database,
      host: this.config.host,
      port: this.config.port,
      poolSize: this.config.poolSize,
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
    };
  }

  /**
   * 验证配置
   */
  private validateConfig(): void {
    const errors: string[] = [];

    if (!this.config.host) {
      errors.push('数据库主机地址不能为空');
    }
    if (!this.config.port || this.config.port <= 0 || this.config.port > 65535) {
      errors.push('数据库端口必须在1-65535之间');
    }
    if (!this.config.username) {
      errors.push('数据库用户名不能为空');
    }
    if (!this.config.database) {
      errors.push('数据库名称不能为空');
    }
    if (this.config.poolSize <= 0) {
      errors.push('连接池大小必须为正数');
    }
    if (this.config.retryAttempts <= 0) {
      errors.push('重试次数必须为正数');
    }
    if (this.config.slowQueryThreshold <= 0) {
      errors.push('慢查询阈值必须为正数');
    }

    if (errors.length > 0) {
      logger.error('[Database] 配置验证失败', { errors });
      throw new Error(`数据库配置验证失败: ${errors.join(', ')}`);
    }

    logger.info('[Database] 配置验证通过', {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      poolSize: this.config.poolSize,
      retryAttempts: this.config.retryAttempts,
      sslEnabled: !!this.config.ssl,
    });
  }

  // ============================================
  // 连接管理
  // ============================================

  /**
   * 获取数据源选项
   */
  getDataSourceOptions(): DataSourceOptions {
    const config = this.config;

    return {
      type: config.type as any,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: config.synchronize,
      logging: config.logging,
      entities: config.entities,
      migrations: config.migrations,
      subscribers: config.subscribers,
      poolSize: config.poolSize,
      connectTimeout: config.connectTimeout,
      acquireTimeout: config.acquireTimeout,
      idleTimeout: config.idleTimeout,
      maxQueryExecutionTime: config.maxQueryExecutionTime,
      charset: config.charset,
      timezone: config.timezone,
      supportBigNumbers: config.supportBigNumbers,
      bigNumberStrings: config.bigNumberStrings,
      ssl: config.ssl,
      extra: {
        connectionLimit: config.poolSize,
        maxLifetime: config.maxLifetime,
        connectionTimeout: config.connectionTimeout,
        ...(config.type === 'mysql' && {
          supportBigNumbers: config.supportBigNumbers,
          bigNumberStrings: config.bigNumberStrings,
        }),
      },
    };
  }

  /**
   * 创建数据源实例
   */
  createDataSource(): DataSource {
    return new DataSource(this.getDataSourceOptions());
  }

  /**
   * 连接到数据库（带重试）
   */
  async connect(): Promise<DataSource> {
    if (this.isConnecting) {
      logger.warn('[Database] 连接正在进行中...');
      return this.dataSource as DataSource;
    }

    if (this.dataSource?.isInitialized) {
      logger.info('[Database] 数据库已连接');
      return this.dataSource;
    }

    this.isConnecting = true;
    let attempt = 0;

    try {
      while (attempt < this.config.retryAttempts) {
        attempt++;
        try {
          logger.info(`[Database] 尝试连接数据库 (${attempt}/${this.config.retryAttempts})`, {
            host: this.config.host,
            port: this.config.port,
            database: this.config.database,
          });

          this.dataSource = this.createDataSource();
          await this.dataSource.initialize();

          // 连接成功
          this.connectTime = new Date();
          this.retryCount = 0;
          this.lastError = null;
          this.connectionStatus.isConnected = true;
          this.connectionStatus.lastConnectTime = this.connectTime;

          // 更新连接池状态
          const pool = (this.dataSource.driver as any)?.pool;
          if (pool) {
            const stats = pool.stats?.();
            if (stats) {
              this.connectionStatus.activeConnections = stats.activeConnections || 0;
              this.connectionStatus.idleConnections = stats.idleConnections || 0;
              this.connectionStatus.totalConnections = stats.totalConnections || 0;
            }
          }

          // 设置慢查询日志
          if (this.config.enableSlowQueryLog) {
            this.setupSlowQueryLogging();
          }

          logger.info('[Database] 数据库连接成功', {
            database: this.config.database,
            host: this.config.host,
            poolSize: this.config.poolSize,
            uptime: this.getUptime(),
          });

          this.isConnecting = false;
          return this.dataSource;

        } catch (error) {
          this.lastError = error as Error;
          const err = error as Error;
          logger.warn(`[Database] 连接失败 (${attempt}/${this.config.retryAttempts})`, {
            error: err.message,
            stack: err.stack,
          });

          if (attempt < this.config.retryAttempts) {
            // 指数退避延迟
            const delay = this.config.retryDelay * Math.pow(this.config.retryBackoff, attempt - 1);
            logger.info(`[Database] ${delay}ms 后重试...`);
            await this.sleep(delay);
          }
        }
      }

      // 所有重试失败
      this.connectionStatus.isConnected = false;
      this.isConnecting = false;
      throw new Error(
        `数据库连接失败: 已重试 ${this.config.retryAttempts} 次。最后错误: ${this.lastError?.message}`
      );

    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * 断开数据库连接
   */
  async disconnect(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.connectionStatus.isConnected = false;
      this.connectTime = null;
      logger.info('[Database] 数据库连接已断开');
    }
  }

  /**
   * 设置慢查询日志
   */
  private setupSlowQueryLogging(): void {
    // 监听查询事件
    const driver = this.dataSource?.driver as any;
    if (driver && driver.connection) {
      // 对于MySQL，可以设置慢查询日志
      this.dataSource?.query(`
        SET GLOBAL slow_query_log = 'ON';
        SET GLOBAL long_query_time = ${this.config.slowQueryThreshold / 1000};
      `).catch((error) => {
        logger.warn('[Database] 设置慢查询日志失败', { error: error.message });
      });

      logger.info('[Database] 慢查询日志已启用', {
        threshold: `${this.config.slowQueryThreshold}ms`,
      });
    }
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): ConnectionStatus {
    if (this.dataSource?.isInitialized) {
      this.connectionStatus.isConnected = true;
      this.connectionStatus.uptime = this.getUptime();

      // 更新连接池状态
      const pool = (this.dataSource.driver as any)?.pool;
      if (pool) {
        const stats = pool.stats?.();
        if (stats) {
          this.connectionStatus.activeConnections = stats.activeConnections || 0;
          this.connectionStatus.idleConnections = stats.idleConnections || 0;
          this.connectionStatus.totalConnections = stats.totalConnections || 0;
        }
      }
    } else {
      this.connectionStatus.isConnected = false;
    }

    if (this.lastError) {
      this.connectionStatus.lastError = this.lastError.message;
    }

    return { ...this.connectionStatus };
  }

  /**
   * 获取运行时间
   */
  private getUptime(): number {
    if (!this.connectTime) return 0;
    return Math.floor((Date.now() - this.connectTime.getTime()) / 1000);
  }

  /**
   * 检查连接是否健康
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      if (!this.dataSource?.isInitialized) {
        return { healthy: false, message: '数据库未初始化' };
      }

      // 执行简单查询检查连接
      await this.dataSource.query('SELECT 1');
      return { healthy: true, message: '连接正常' };
    } catch (error) {
      const err = error as Error;
      logger.error('[Database] 健康检查失败', { error: err.message });
      return { healthy: false, message: err.message };
    }
  }

  // ============================================
  // 工具方法
  // ============================================

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取配置
   */
  getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  /**
   * 获取数据源
   */
  getDataSource(): DataSource | null {
    return this.dataSource;
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return !!(this.dataSource?.isInitialized);
  }

  /**
   * 获取连接池统计
   */
  getPoolStats(): {
    poolSize: number;
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
    retryCount: number;
  } {
    const status = this.getConnectionStatus();
    return {
      poolSize: this.config.poolSize,
      activeConnections: status.activeConnections || 0,
      idleConnections: status.idleConnections || 0,
      totalConnections: status.totalConnections || 0,
      retryCount: this.retryCount,
    };
  }
}

// ============================================
// 默认导出
// ============================================

export const dbManager = DatabaseConfigManager.getInstance();

// 创建数据源实例（延迟初始化）
export const dataSource = dbManager.createDataSource();

// 连接数据库
export async function connectDatabase(): Promise<DataSource> {
  return dbManager.connect();
}

// 断开数据库
export async function disconnectDatabase(): Promise<void> {
  return dbManager.disconnect();
}

export default dataSource;