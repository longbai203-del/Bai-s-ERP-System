/**
 * 配置层统一导出
 * 提供所有系统配置的集中管理
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export { default as databaseConfig } from './database';
export { 
    appLogger, 
    accessLogger, 
    errorLogger, 
    dbLogger,
    LoggerUtils,
    createLogger,
    LogLevel
} from './winston.config';
export { logRotateManager, LogRotateManager } from './logrotate.config';
export { default as morganConfig } from './morgan.config';

export class AppConfig {
    static getAppName(): string {
        return process.env.APP_NAME || 'ERP System';
    }

    static getEnvironment(): string {
        return process.env.NODE_ENV || 'development';
    }

    static isProduction(): boolean {
        return this.getEnvironment() === 'production';
    }

    static isDevelopment(): boolean {
        return this.getEnvironment() === 'development';
    }

    static getPort(): number {
        return parseInt(process.env.PORT || '3000', 10);
    }

    static getApiPrefix(): string {
        return process.env.API_PREFIX || '/api';
    }

    static getJwtSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret && this.isProduction()) {
            throw new Error('JWT_SECRET is required in production environment');
        }
        return secret || 'default-dev-secret';
    }

    static getJwtExpiresIn(): string {
        return process.env.JWT_EXPIRES_IN || '7d';
    }

    static getDatabaseUrl(): string {
        const url = process.env.DATABASE_URL;
        if (!url && this.isProduction()) {
            throw new Error('DATABASE_URL is required in production environment');
        }
        return url || 'postgresql://localhost:5432/erp_db';
    }

    static getCorsOptions() {
        return {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        };
    }

    static getAllConfigs(): Record<string, any> {
        return {
            appName: this.getAppName(),
            environment: this.getEnvironment(),
            isProduction: this.isProduction(),
            port: this.getPort(),
            apiPrefix: this.getApiPrefix(),
            jwtExpiresIn: this.getJwtExpiresIn(),
            databaseUrl: this.getDatabaseUrl(),
            corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
        };
    }
}

export default {
    AppConfig,
    databaseConfig,
    morganConfig,
    appLogger,
    accessLogger,
    errorLogger,
    dbLogger,
    LoggerUtils,
    LogLevel,
    logRotateManager,
    LogRotateManager
};
