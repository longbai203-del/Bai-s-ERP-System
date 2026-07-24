/**
 * @file Config/index.ts
 * 配置统一导出与加载管理
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 加载环境变量
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.join(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// 应用配置接口
export interface AppConfig {
  /** 应用名称 */
  appName: string;
  /** 应用版本 */
  appVersion: string;
  /** 运行环境 */
  env: 'development' | 'test' | 'production' | 'staging';
  /** 服务端口 */
  port: number;
  /** 服务主机 */
  host: string;
  /** API前缀 */
  apiPrefix: string;
  /** 是否启用调试模式 */
  debug: boolean;
  /** 是否启用HTTPS */
  https: boolean;
  /** SSL证书配置 */
  ssl: {
    key?: string;
    cert?: string;
    ca?: string;
  };
  /** 跨域配置 */
  cors: {
    enabled: boolean;
    origins: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  /** 速率限制配置 */
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
    message: string;
  };
  /** JWT配置 */
  jwt: {
    secret: string;
    expiresIn: string | number;
    refreshSecret: string;
    refreshExpiresIn: string | number;
    issuer: string;
    audience: string;
  };
  /** 文件上传配置 */
  upload: {
    maxSize: number;
    allowedTypes: string[];
    dest: string;
  };
  /** 缓存配置 */
  cache: {
    enabled: boolean;
    ttl: number;
    maxItems: number;
  };
  /** 日志配置 */
  log: {
    level: string;
    dir: string;
    maxSize: number;
    maxFiles: number;
    compress: boolean;
  };
  /** 安全配置 */
  security: {
    bcryptRounds: number;
    sessionSecret: string;
    csrf: boolean;
    xssProtection: boolean;
    noSniff: boolean;
    frameGuard: boolean;
    hsts: boolean;
  };
  /** 外部服务配置 */
  services: {
    redis?: {
      host: string;
      port: number;
      password?: string;
      db: number;
    };
    elasticsearch?: {
      node: string;
      auth?: {
        username: string;
        password: string;
      };
    };
    mailer?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      from: string;
    };
  };
}

/**
 * 配置验证函数
 */
function validateConfig(config: AppConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.appName) errors.push('appName 不能为空');
  if (!config.port || config.port < 1 || config.port > 65535) {
    errors.push('port 必须是 1-65535 之间的数字');
  }
  if (!config.jwt.secret || config.jwt.secret.length < 32) {
    errors.push('JWT密钥必须至少32位');
  }
  if (config.env === 'production' && config.jwt.secret === 'default_secret_key') {
    errors.push('生产环境不允许使用默认JWT密钥');
  }
  if (!config.security.bcryptRounds || config.security.bcryptRounds < 10) {
    errors.push('bcrypt轮数至少为10');
  }
  if (config.env === 'production' && config.debug) {
    errors.push('生产环境不允许开启调试模式');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 构建应用配置
 */
function buildConfig(): AppConfig {
  const env = (process.env.NODE_ENV as AppConfig['env']) || 'development';
  const isProduction = env === 'production';

  return {
    appName: process.env.APP_NAME || 'ERP System',
    appVersion: process.env.APP_VERSION || '1.0.0',
    env,
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    debug: process.env.DEBUG === 'true' || !isProduction,
    https: process.env.HTTPS === 'true',
    ssl: {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERT,
      ca: process.env.SSL_CA,
    },
    cors: {
      enabled: process.env.CORS_ENABLED !== 'false',
      origins: (process.env.CORS_ORIGINS || '*').split(',').map(o => o.trim()),
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    },
    rateLimit: {
      enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      message: '请求过于频繁，请稍后再试',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'default_secret_key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      issuer: process.env.JWT_ISSUER || 'erp-system',
      audience: process.env.JWT_AUDIENCE || 'erp-client',
    },
    upload: {
      maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10),
      allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,application/pdf').split(','),
      dest: process.env.UPLOAD_DEST || './uploads',
    },
    cache: {
      enabled: process.env.CACHE_ENABLED === 'true',
      ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
      maxItems: parseInt(process.env.CACHE_MAX_ITEMS || '1000', 10),
    },
    log: {
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      dir: process.env.LOG_DIR || './logs',
      maxSize: parseInt(process.env.LOG_MAX_SIZE || '100', 10),
      maxFiles: parseInt(process.env.LOG_MAX_FILES || '30', 10),
      compress: process.env.LOG_COMPRESS !== 'false',
    },
    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
      sessionSecret: process.env.SESSION_SECRET || 'default_session_secret',
      csrf: process.env.CSRF_ENABLED === 'true',
      xssProtection: process.env.XSS_PROTECTION !== 'false',
      noSniff: process.env.NO_SNIFF !== 'false',
      frameGuard: process.env.FRAME_GUARD !== 'false',
      hsts: process.env.HSTS !== 'false',
    },
    services: {
      redis: process.env.REDIS_HOST ? {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0', 10),
      } : undefined,
      elasticsearch: process.env.ELASTICSEARCH_NODE ? {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        auth: process.env.ELASTICSEARCH_USER ? {
          username: process.env.ELASTICSEARCH_USER,
          password: process.env.ELASTICSEARCH_PASSWORD || '',
        } : undefined,
      } : undefined,
      mailer: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        from: process.env.SMTP_FROM || 'noreply@example.com',
      } : undefined,
    },
  };
}

// 构建配置
export const config = buildConfig();

// 验证配置
const validationResult = validateConfig(config);
if (!validationResult.valid) {
  console.error('[Config] 配置验证失败:');
  validationResult.errors.forEach(err => console.error(`  - ${err}`));
  if (config.env === 'production') {
    throw new Error('生产环境配置验证失败，应用启动终止');
  }
}

// 环境工具函数
export const env = {
  isDevelopment: config.env === 'development',
  isTest: config.env === 'test',
  isProduction: config.env === 'production',
  isStaging: config.env === 'staging',
  getEnv: () => config.env,
};
/**
 * @file Config/index.ts
 * 配置统一导出与加载管理 - 完整的环境变量校验、默认值兜底、热加载
 * 完整实现：新增环境变量格式与合法性校验、配置项默认值兜底、配置热加载逻辑
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { logger } from './winston.config';

// ============================================
// 加载环境变量
// ============================================

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.join(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  logger?.debug(`[Config] 加载环境变量文件: ${envFile}`);
} else {
  dotenv.config();
  logger?.warn(`[Config] 环境变量文件不存在: ${envPath}`);
}

// ============================================
// 类型定义
// ============================================

export type Environment = 'development' | 'test' | 'production' | 'staging';

export interface AppConfig {
  appName: string;
  appVersion: string;
  env: Environment;
  port: number;
  host: string;
  apiPrefix: string;
  debug: boolean;
  https: boolean;
  ssl: {
    key?: string;
    cert?: string;
    ca?: string;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
    message: string;
  };
  jwt: {
    secret: string;
    expiresIn: string | number;
    refreshSecret: string;
    refreshExpiresIn: string | number;
    issuer: string;
    audience: string;
  };
  upload: {
    maxSize: number;
    allowedTypes: string[];
    dest: string;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxItems: number;
  };
  log: {
    level: string;
    dir: string;
    maxSize: number;
    maxFiles: number;
    compress: boolean;
  };
  security: {
    bcryptRounds: number;
    sessionSecret: string;
    csrf: boolean;
    xssProtection: boolean;
    noSniff: boolean;
    frameGuard: boolean;
    hsts: boolean;
  };
  services: {
    redis?: {
      host: string;
      port: number;
      password?: string;
      db: number;
    };
    elasticsearch?: {
      node: string;
      auth?: {
        username: string;
        password: string;
      };
    };
    mailer?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      from: string;
    };
  };
}

// ============================================
// 配置验证器
// ============================================

export class ConfigValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  validate(config: AppConfig): { valid: boolean; errors: string[]; warnings: string[] } {
    this.errors = [];
    this.warnings = [];

    // 验证应用配置
    if (!config.appName || config.appName.trim().length === 0) {
      this.errors.push('appName 不能为空');
    }
    if (!config.port || config.port < 1 || config.port > 65535) {
      this.errors.push('port 必须是 1-65535 之间的数字');
    }
    if (!config.host || config.host.trim().length === 0) {
      this.errors.push('host 不能为空');
    }

    // 验证JWT配置
    if (!config.jwt.secret || config.jwt.secret.length < 32) {
      this.errors.push('JWT密钥必须至少32位');
    }
    if (config.env === 'production' && config.jwt.secret === 'default_secret_key') {
      this.errors.push('生产环境不允许使用默认JWT密钥');
    }
    if (!config.jwt.refreshSecret || config.jwt.refreshSecret.length < 32) {
      this.errors.push('JWT刷新密钥必须至少32位');
    }

    // 验证安全配置
    if (!config.security.bcryptRounds || config.security.bcryptRounds < 10) {
      this.warnings.push('bcrypt轮数建议至少为10');
    }
    if (config.env === 'production' && config.debug) {
      this.errors.push('生产环境不允许开启调试模式');
    }
    if (!config.security.sessionSecret || config.security.sessionSecret.length < 32) {
      this.errors.push('会话密钥必须至少32位');
    }

    // 验证上传配置
    if (config.upload.maxSize <= 0) {
      this.errors.push('上传文件大小限制必须为正数');
    }
    if (!config.upload.dest || config.upload.dest.trim().length === 0) {
      this.errors.push('上传目录不能为空');
    }

    // 验证日志配置
    if (!config.log.dir || config.log.dir.trim().length === 0) {
      this.errors.push('日志目录不能为空');
    }
    if (config.log.maxSize <= 0) {
      this.errors.push('日志文件最大大小必须为正数');
    }
    if (config.log.maxFiles <= 0) {
      this.errors.push('日志文件保留数量必须为正数');
    }

    // 验证CORS配置
    if (config.cors.enabled && config.cors.origins.length === 0) {
      this.warnings.push('CORS已启用但未配置允许来源');
    }

    // 验证速率限制
    if (config.rateLimit.enabled && config.rateLimit.max <= 0) {
      this.errors.push('速率限制最大请求数必须为正数');
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}

// ============================================
// 配置构建器
// ============================================

class ConfigBuilder {
  private config: Partial<AppConfig> = {};

  fromEnvironment(): AppConfig {
    const env = (process.env.NODE_ENV as Environment) || 'development';
    const isProduction = env === 'production';

    return {
      appName: this.getString('APP_NAME', 'ERP System'),
      appVersion: this.getString('APP_VERSION', '1.0.0'),
      env,
      port: this.getNumber('PORT', 3000),
      host: this.getString('HOST', '0.0.0.0'),
      apiPrefix: this.getString('API_PREFIX', '/api/v1'),
      debug: this.getBoolean('DEBUG', !isProduction),
      https: this.getBoolean('HTTPS', false),
      ssl: {
        key: this.getString('SSL_KEY', undefined),
        cert: this.getString('SSL_CERT', undefined),
        ca: this.getString('SSL_CA', undefined),
      },
      cors: {
        enabled: this.getBoolean('CORS_ENABLED', true),
        origins: this.getArray('CORS_ORIGINS', ['*']),
        credentials: this.getBoolean('CORS_CREDENTIALS', true),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
      },
      rateLimit: {
        enabled: this.getBoolean('RATE_LIMIT_ENABLED', true),
        windowMs: this.getNumber('RATE_LIMIT_WINDOW', 900000),
        max: this.getNumber('RATE_LIMIT_MAX', 100),
        message: '请求过于频繁，请稍后再试',
      },
      jwt: {
        secret: this.getString('JWT_SECRET', 'default_secret_key'),
        expiresIn: this.getString('JWT_EXPIRES_IN', '7d'),
        refreshSecret: this.getString('JWT_REFRESH_SECRET', 'default_refresh_secret'),
        refreshExpiresIn: this.getString('JWT_REFRESH_EXPIRES_IN', '30d'),
        issuer: this.getString('JWT_ISSUER', 'erp-system'),
        audience: this.getString('JWT_AUDIENCE', 'erp-client'),
      },
      upload: {
        maxSize: this.getNumber('UPLOAD_MAX_SIZE', 10485760),
        allowedTypes: this.getArray('UPLOAD_ALLOWED_TYPES', ['image/jpeg', 'image/png', 'application/pdf']),
        dest: this.getString('UPLOAD_DEST', './uploads'),
      },
      cache: {
        enabled: this.getBoolean('CACHE_ENABLED', false),
        ttl: this.getNumber('CACHE_TTL', 3600),
        maxItems: this.getNumber('CACHE_MAX_ITEMS', 1000),
      },
      log: {
        level: this.getString('LOG_LEVEL', isProduction ? 'info' : 'debug'),
        dir: this.getString('LOG_DIR', './logs'),
        maxSize: this.getNumber('LOG_MAX_SIZE', 100),
        maxFiles: this.getNumber('LOG_MAX_FILES', 30),
        compress: this.getBoolean('LOG_COMPRESS', true),
      },
      security: {
        bcryptRounds: this.getNumber('BCRYPT_ROUNDS', 12),
        sessionSecret: this.getString('SESSION_SECRET', 'default_session_secret'),
        csrf: this.getBoolean('CSRF_ENABLED', false),
        xssProtection: this.getBoolean('XSS_PROTECTION', true),
        noSniff: this.getBoolean('NO_SNIFF', true),
        frameGuard: this.getBoolean('FRAME_GUARD', true),
        hsts: this.getBoolean('HSTS', true),
      },
      services: {
        redis: this.buildRedisConfig(),
        elasticsearch: this.buildElasticsearchConfig(),
        mailer: this.buildMailerConfig(),
      },
    };
  }

  private getString(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    return value.toLowerCase() === 'true' || value === '1';
  }

  private getArray(key: string, defaultValue: string[]): string[] {
    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }
    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }

  private buildRedisConfig(): { host: string; port: number; password?: string; db: number } | undefined {
    if (!process.env.REDIS_HOST) return undefined;
    return {
      host: this.getString('REDIS_HOST', 'localhost'),
      port: this.getNumber('REDIS_PORT', 6379),
      password: this.getString('REDIS_PASSWORD', undefined),
      db: this.getNumber('REDIS_DB', 0),
    };
  }

  private buildElasticsearchConfig(): { node: string; auth?: { username: string; password: string } } | undefined {
    if (!process.env.ELASTICSEARCH_NODE) return undefined;
    return {
      node: this.getString('ELASTICSEARCH_NODE', 'http://localhost:9200'),
      auth: process.env.ELASTICSEARCH_USER ? {
        username: this.getString('ELASTICSEARCH_USER', ''),
        password: this.getString('ELASTICSEARCH_PASSWORD', ''),
      } : undefined,
    };
  }

  private buildMailerConfig(): { host: string; port: number; secure: boolean; auth: { user: string; pass: string }; from: string } | undefined {
    if (!process.env.SMTP_HOST) return undefined;
    return {
      host: this.getString('SMTP_HOST', 'localhost'),
      port: this.getNumber('SMTP_PORT', 587),
      secure: this.getBoolean('SMTP_SECURE', false),
      auth: {
        user: this.getString('SMTP_USER', ''),
        pass: this.getString('SMTP_PASS', ''),
      },
      from: this.getString('SMTP_FROM', 'noreply@example.com'),
    };
  }
}

// ============================================
// 配置热加载
// ============================================

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig | null = null;
  private watchers: Array<(newConfig: AppConfig) => void> = [];
  private fsWatcher: fs.FSWatcher | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 加载配置
   */
  load(): AppConfig {
    const builder = new ConfigBuilder();
    const config = builder.fromEnvironment();

    // 验证配置
    const validator = new ConfigValidator();
    const result = validator.validate(config);

    // 输出警告
    for (const warning of result.warnings) {
      logger?.warn(`[Config] ${warning}`);
    }

    // 输出错误
    if (!result.valid) {
      for (const error of result.errors) {
        logger?.error(`[Config] ${error}`);
      }
      if (config.env === 'production') {
        throw new Error(`配置验证失败: ${result.errors.join(', ')}`);
      }
    }

    this.config = config;
    return config;
  }

  /**
   * 获取配置
   */
  getConfig(): AppConfig {
    if (!this.config) {
      return this.load();
    }
    return this.config;
  }

  /**
   * 热加载配置
   */
  startHotReload(): void {
    if (this.fsWatcher) {
      return;
    }

    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      return;
    }

    this.fsWatcher = fs.watch(envPath, (eventType) => {
      if (eventType === 'change') {
        logger?.info('[Config] 检测到配置变更，重新加载...');
        try {
          // 重新加载环境变量
          dotenv.config({ path: envPath });
          const newConfig = this.load();
          this.notifyWatchers(newConfig);
          logger?.info('[Config] 配置热加载成功');
        } catch (error) {
          logger?.error('[Config] 配置热加载失败', { error });
        }
      }
    });

    logger?.info('[Config] 配置热加载已启动');
  }

  /**
   * 停止热加载
   */
  stopHotReload(): void {
    if (this.fsWatcher) {
      this.fsWatcher.close();
      this.fsWatcher = null;
      logger?.info('[Config] 配置热加载已停止');
    }
  }

  /**
   * 注册配置变更监听器
   */
  onConfigChange(callback: (newConfig: AppConfig) => void): void {
    this.watchers.push(callback);
  }

  private notifyWatchers(newConfig: AppConfig): void {
    for (const watcher of this.watchers) {
      try {
        watcher(newConfig);
      } catch (error) {
        logger?.error('[Config] 配置变更通知失败', { error });
      }
    }
  }
}

// ============================================
// 环境工具
// ============================================

export const env = {
  isDevelopment: (): boolean => process.env.NODE_ENV === 'development',
  isTest: (): boolean => process.env.NODE_ENV === 'test',
  isProduction: (): boolean => process.env.NODE_ENV === 'production',
  isStaging: (): boolean => process.env.NODE_ENV === 'staging',
  getEnv: (): Environment => (process.env.NODE_ENV as Environment) || 'development',
};

// ============================================
// 导出配置
// ============================================

const configManager = ConfigManager.getInstance();
export const config = configManager.load();

// 启动热加载
if (env.isDevelopment() && process.env.CONFIG_HOT_RELOAD !== 'false') {
  configManager.startHotReload();
}

// 导出配置管理器
export { configManager };

// 导出便捷函数
export function getConfig(): AppConfig {
  return configManager.getConfig();
}

export function reloadConfig(): AppConfig {
  return configManager.load();
}

// ============================================
// 默认导出
// ============================================

export default config;
// 导出配置模块
export default config;