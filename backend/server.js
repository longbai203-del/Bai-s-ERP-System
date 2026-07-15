/**
 * @file server.js
 * @description 后端服务入口
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import { logger } from './src/utils/logger.js';
import { config } from './src/config.js';

const app = express();
const PORT = config.port || 3000;

// 中间件
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 根路径
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bai\'s ERP API Server',
        version: config.version || '2.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv || 'development'
    });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API 端点不存在',
        path: req.originalUrl,
        method: req.method,
        timestamp: Date.now()
    });
});

// 错误处理
app.use((err, req, res, next) => {
    logger.error('[Server] 错误:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '服务器内部错误',
        timestamp: Date.now()
    });
});

// 启动
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 API Server running on port ${PORT}`);
    logger.info(`📚 Health check: http://localhost:${PORT}/health`);
    logger.info(`📋 Environment: ${config.nodeEnv || 'development'}`);
});

export default app;