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
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试',
        code: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});

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

// ==========================
// CORS 配置 - 允许所有来源 (开发/生产通用)
// ==========================
app.use(cors({
    origin: function (origin, callback) {
        // 允许没有 origin 的请求 (如 Postman)
        if (!origin) return callback(null, true);
        
        // 允许所有来源 (开发阶段)
        // 生产环境可以限制为特定域名
        const allowedOrigins = [
            'https://bai-s-erp-system.vercel.app',
            'https://bais-erp-backend.onrender.com',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000'
        ];
        
        // 检查是否在允许列表中，或允许所有
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log('⚠️  Blocked CORS request from:', origin);
            callback(null, true); // 开发阶段允许所有
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24小时缓存预检结果
}));

// ==========================
// 处理所有 OPTIONS 预检请求
// ==========================
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
});

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


// 根路径响应
app.get('/', (req, res) => {
    res.json({
        message: 'Bai\'s ERP API',
        version: require('../package.json').version || '1.0.0',
        docs: '/api-docs',
        health: '/health',
        api: '/api'
    });
});

module.exports = app;

