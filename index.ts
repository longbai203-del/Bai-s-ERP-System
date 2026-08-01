/**
 * Config 统一导出
 * 配置层出口
 */
export { default as databaseConfig } from './database';
export { default as morganConfig } from './morgan.config';
export { default as winstonConfig, logger } from './winston.config';
export { default as logRotateConfig } from './logrotate.config';

/**
 * 配置管理器
 * 提供统一的配置加载和验证
 */
import * as dotenv from 'dotenv';
import { logger } from './winston.config';

// 加载环境变量
dotenv.config();

export class ConfigManager {
    private static instance: ConfigManager;
    private config: Map<string, any> = new Map();

    private constructor() {
        this.loadConfig();
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private loadConfig(): void {
        try {
            // 服务器配置
            this.config.set('server', {
                port: parseInt(process.env.PORT || '3000'),
                env: process.env.NODE_ENV || 'development',
                host: process.env.HOST || '0.0.0.0'
            });

            // 数据库配置
            this.config.set('database', {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USERNAME || 'erp_user',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'erp_db',
                dialect: process.env.DB_DIALECT || 'mysql'
            });

            // Redis配置
            this.config.set('redis', {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD || '',
                db: parseInt(process.env.REDIS_DB || '0')
            });

            // JWT配置
            this.config.set('jwt', {
                secret: process.env.JWT_SECRET || 'default_secret_key',
                refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
                refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
            });

            // 日志配置
            this.config.set('log', {
                level: process.env.LOG_LEVEL || 'info',
                dir: process.env.LOG_DIR || 'logs',
                maxSize: parseInt(process.env.LOG_MAX_SIZE || '100'),
                maxFiles: parseInt(process.env.LOG_MAX_FILES || '30')
            });

            // 上传配置
            this.config.set('upload', {
                maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'),
                allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/*,application/pdf').Split(','),
                uploadDir: process.env.UPLOAD_DIR || 'uploads'
            });

            logger.info('配置加载成功');
        } catch (error) {
            logger.error('配置加载失败:', error);
            throw error;
        }
    }

    public get(key: string): any {
        return this.config.get(key);
    }

    public getServerConfig(): any {
        return this.get('server');
    }

    public getDatabaseConfig(): any {
        return this.get('database');
    }

    public getRedisConfig(): any {
        return this.get('redis');
    }

    public getJWTConfig(): any {
        return this.get('jwt');
    }

    public getLogConfig(): any {
        return this.get('log');
    }

    public getUploadConfig(): any {
        return this.get('upload');
    }

    public reload(): void {
        this.config.clear();
        this.loadConfig();
    }
}

export const configManager = ConfigManager.getInstance();
export default configManager;
