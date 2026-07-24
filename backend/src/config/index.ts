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

// 导出配置模块
export default config;