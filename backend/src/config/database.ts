/**
 * @file Config/database.ts
 * 数据库配置 - 生产级连接管理
 */

import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

// 数据库类型
export type DatabaseType = 'mysql' | 'postgres' | 'sqlite' | 'mongodb';

// 数据库配置接口
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
}

/**
 * 数据库配置管理类
 */
export class DatabaseConfigManager {
  private static instance: DatabaseConfigManager;
  private config: DatabaseConfig;

  private constructor() {
    this.config = this.buildConfig();
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
    };

    // SSL配置
    if (process.env.DB_SSL === 'true') {
      baseConfig.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      };
      if (process.env.DB_SSL_CA) {
        baseConfig.ssl.ca = process.env.DB_SSL_CA;
      }
      if (process.env.DB_SSL_KEY) {
        baseConfig.ssl.key = process.env.DB_SSL_KEY;
      }
      if (process.env.DB_SSL_CERT) {
        baseConfig.ssl.cert = process.env.DB_SSL_CERT;
      }
    }

    // 测试环境特殊配置
    if (isTest) {
      baseConfig.database = `${baseConfig.database}_test`;
      baseConfig.synchronize = true;
      baseConfig.logging = false;
    }

    return baseConfig;
  }

  /**
   * 获取TypeORM数据源配置
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
   * 验证数据库连接配置
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.config;

    if (!config.host) {
      errors.push('数据库主机地址不能为空');
    }

    if (!config.port || config.port <= 0) {
      errors.push('数据库端口必须为正整数');
    }

    if (!config.username) {
      errors.push('数据库用户名不能为空');
    }

    if (!config.database) {
      errors.push('数据库名称不能为空');
    }

    if (!config.entities || config.entities.length === 0) {
      errors.push('实体路径配置不能为空');
    }

    if (config.poolSize <= 0) {
      errors.push('连接池大小必须为正数');
    }

    if (config.connectTimeout <= 0) {
      errors.push('连接超时时间必须为正数');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 获取连接池状态
   */
  getPoolStats() {
    return {
      poolSize: this.config.poolSize,
      connectTimeout: this.config.connectTimeout,
      acquireTimeout: this.config.acquireTimeout,
      idleTimeout: this.config.idleTimeout,
      activeConnections: undefined, // 实际连接数需要从数据源获取
      maxConnections: this.config.poolSize,
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): DatabaseConfig {
    return { ...this.config };
  }
}

// 默认导出数据源实例
export const dataSource = DatabaseConfigManager.getInstance().createDataSource();

// 导出数据库连接管理器
export const dbManager = DatabaseConfigManager.getInstance();

export default dataSource;