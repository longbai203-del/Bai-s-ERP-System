/**
 * @file logger.js
 * @description 日志工具
 * @module utils/logger
 */

import { config } from '../config.js';

/**
 * 日志级别
 */
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
};

/**
 * 获取当前日志级别
 */
const currentLevel = LOG_LEVELS[config.logLevel] ?? LOG_LEVELS.info;

/**
 * 格式化时间
 */
const formatTime = () => {
    return new Date().toISOString();
};

/**
 * 格式化日志消息
 */
const formatMessage = (level, message, ...args) => {
    const time = formatTime();
    const prefix = `[${time}] [${level.toUpperCase()}]`;
    if (args.length > 0) {
        return `${prefix} ${message}`;
    }
    return `${prefix} ${message}`;
};

/**
 * 日志对象
 */
export const logger = {
    /**
     * 调试日志
     */
    debug: (message, ...args) => {
        if (currentLevel <= LOG_LEVELS.debug) {
            console.debug(formatMessage('debug', message), ...args);
        }
    },

    /**
     * 信息日志
     */
    info: (message, ...args) => {
        if (currentLevel <= LOG_LEVELS.info) {
            console.info(formatMessage('info', message), ...args);
        }
    },

    /**
     * 警告日志
     */
    warn: (message, ...args) => {
        if (currentLevel <= LOG_LEVELS.warn) {
            console.warn(formatMessage('warn', message), ...args);
        }
    },

    /**
     * 错误日志
     */
    error: (message, ...args) => {
        if (currentLevel <= LOG_LEVELS.error) {
            console.error(formatMessage('error', message), ...args);
        }
    },

    /**
     * 创建带上下文的日志器
     */
    child: (context) => {
        return {
            debug: (message, ...args) => logger.debug(`[${context}] ${message}`, ...args),
            info: (message, ...args) => logger.info(`[${context}] ${message}`, ...args),
            warn: (message, ...args) => logger.warn(`[${context}] ${message}`, ...args),
            error: (message, ...args) => logger.error(`[${context}] ${message}`, ...args)
        };
    }
};

export default logger;