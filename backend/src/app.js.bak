/**
 * @file app.js
 * @description 主应用文件 - 集成所有中间件和路由
 * @module app
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./errors/ErrorHandler');
const { requestLogger } = require('./middleware/logger');
const setupSwagger = require('./swagger');

const app = express();

// ==========================
// 速率限制中间件
// ==========================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP最多100个请求
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试',
        code: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 对API路由启用速率限制
app.use('/api', limiter);

// ==========================
// 安全中间件
// ==========================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://*.supabase.co"]
        }
    }
}));

// CORS配置
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ==========================
// 日志中间件
// ==========================
app.use(morgan('combined'));
app.use(requestLogger);

// ==========================
// 解析中间件
// ==========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================
// Swagger API 文档
// ==========================
setupSwagger(app);

// ==========================
// 路由
// ==========================
app.use('/api', routes);

// ==========================
// 健康检查
// ==========================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('../package.json').version || '1.0.0',
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
    });
});

// ==========================
// 错误处理
// ==========================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;