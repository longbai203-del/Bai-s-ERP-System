/**
 * 主应用文件
 * 集成所有中间件和路由
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./errors/ErrorHandler');
const { requestLogger } = require('./middleware/logger');

const app = express();

// ==========================
// 安全中间件
// ==========================
app.use(helmet());

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        environment: process.env.NODE_ENV || 'development'
    });
});

// ==========================
// 错误处理
// ==========================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
