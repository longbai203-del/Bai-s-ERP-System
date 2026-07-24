import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './src/routes';
import { config } from './src/config';
import { connectDatabase } from './src/config/database';
import logger from './src/utils/logger';

dotenv.config();

const app = express();
const PORT = config.port || 3000;

// ===== 中间件 =====
app.use(helmet());
app.use(cors({
  origin: config.frontend?.url || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ===== 健康检查 =====
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '3.0.0',
    environment: config.nodeEnv
  });
});

// ===== API 路由 =====
app.use('/api', routes);

// ===== 404 处理 =====
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'API endpoint not found',
    path: req.path
  });
});

// ===== 错误处理中间件 =====
app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Error:', err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== 启动服务器 =====
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
