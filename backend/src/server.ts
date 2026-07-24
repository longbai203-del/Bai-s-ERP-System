/**
 * @file src/server.ts
 * 应用入口文件 - Express服务器启动与配置
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer, Server } from 'http';
import { config } from '../Config';
import { logger, createChildLogger } from '../Config/winston.config';
import { logRotateManager } from '../Config/logrotate.config';
import { createMorganMiddleware } from '../Config/morgan.config';
import { errorHandlerMiddleware, notFoundHandler, asyncHandler } from './middlewares/error-handler.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { Validator } from './middlewares/validation.middleware';

// 导入路由
import customerRoutes from '../Routes/customer.routes';
import financeRoutes from '../Routes/finance.routes';
import hrRoutes from '../Routes/hr.routes';
import inventoryRoutes from '../Routes/inventory.routes';
import orderRoutes from '../Routes/order.routes';
import productRoutes from '../Routes/product.routes';
import settingsRoutes from '../Routes/settings.routes';

// 导入数据库
import { dataSource, dbManager } from '../Config/database';

class Application {
  private app: express.Application;
  private server: Server | null = null;
  private isShuttingDown: boolean = false;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  /**
   * 初始化中间件
   */
  private initializeMiddlewares(): void {
    const serverLogger = createChildLogger('Server');

    // 安全头设置
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: config.security.hsts ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      } : false,
      frameguard: config.security.frameGuard,
      xssFilter: config.security.xssProtection,
      noSniff: config.security.noSniff,
    }));

    // CORS配置
    if (config.cors.enabled) {
      this.app.use(cors({
        origin: config.cors.origins.length > 0 ? config.cors.origins : true,
        credentials: config.cors.credentials,
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        exposedHeaders: ['X-Total-Count', 'X-Page-Total'],
        maxAge: 86400, // 24小时
      }));
      serverLogger.info('CORS已启用', { origins: config.cors.origins });
    }

    // 请求压缩
    this.app.use(compression({
      level: 6,
      threshold: 1024, // 1KB以上才压缩
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    }));

    // Cookie解析
    this.app.use(cookieParser(config.security.sessionSecret));

    // JSON解析
    this.app.use(express.json({
      limit: '10mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString();
      },
    }));

    // URL编码解析
    this.app.use(express.urlencoded({
      extended: true,
      limit: '10mb',
    }));

    // 请求日志
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(createMorganMiddleware({
        format: process.env.NODE_ENV === 'production' ? 'jsonFile' : 'dev',
        consoleOutput: process.env.NODE_ENV !== 'production',
      }));
    }

    // 速率限制
    if (config.rateLimit.enabled) {
      const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message: config.rateLimit.message || '请求过于频繁，请稍后再试',
          timestamp: new Date().toISOString(),
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
          // 跳过健康检查等路径
          return req.path === '/health' || req.path === '/metrics';
        },
      });
      this.app.use('/api', limiter);
      serverLogger.info('速率限制已启用', {
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
      });
    }

    // 请求上下文设置
    this.app.use((req, res, next) => {
      req.startTime = Date.now();
      res.setHeader('X-Request-Id', `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
      next();
    });

    serverLogger.info('中间件初始化完成');
  }

  /**
   * 初始化路由
   */
  private initializeRoutes(): void {
    const apiPrefix = config.apiPrefix || '/api/v1';

    // 健康检查
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: config.appVersion,
        environment: config.env,
      });
    });

    // 指标端点（可选）
    this.app.get('/metrics', (req, res) => {
      res.json({
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
      });
    });

    // API路由
    this.app.use(`${apiPrefix}/customers`, customerRoutes);
    this.app.use(`${apiPrefix}/finance`, financeRoutes);
    this.app.use(`${apiPrefix}/hr`, hrRoutes);
    this.app.use(`${apiPrefix}/inventory`, inventoryRoutes);
    this.app.use(`${apiPrefix}/orders`, orderRoutes);
    this.app.use(`${apiPrefix}/products`, productRoutes);
    this.app.use(`${apiPrefix}/settings`, settingsRoutes);

    // 404处理
    this.app.use(notFoundHandler);

    logger.info('路由初始化完成', { apiPrefix });
  }

  /**
   * 初始化错误处理器
   */
  private initializeErrorHandlers(): void {
    // 全局错误处理
    this.app.use(errorHandlerMiddleware);

    // 未捕获的异常
    process.on('uncaughtException', (error) => {
      logger.error('未捕获的异常:', {
        error: error.message,
        stack: error.stack,
      });
      if (process.env.NODE_ENV === 'production') {
        this.gracefulShutdown();
      }
    });

    // 未处理的拒绝
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的Promise拒绝:', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
      if (process.env.NODE_ENV === 'production') {
        this.gracefulShutdown();
      }
    });

    // 进程信号处理
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    try {
      const serverLogger = createChildLogger('Startup');

      // 验证数据库配置
      const validation = dbManager.validateConfig();
      if (!validation.valid) {
        serverLogger.error('数据库配置验证失败', { errors: validation.errors });
        throw new Error(`数据库配置验证失败: ${validation.errors.join(', ')}`);
      }

      // 连接数据库
      serverLogger.info('正在连接数据库...');
      await dataSource.initialize();
      serverLogger.info('数据库连接成功', {
        database: dataSource.options.database,
        host: dataSource.options.host,
      });

      // 启动日志轮转
      logRotateManager.checkAndRotate().catch((err) => {
        serverLogger.warn('日志轮转初始化失败', { error: err.message });
      });

      // 创建HTTP服务器
      const port = config.port;
      const host = config.host;

      this.server = createServer(this.app);

      // 监听端口
      this.server.listen(port, host, () => {
        serverLogger.info(`🚀 服务已启动`, {
          environment: config.env,
          host,
          port,
          apiPrefix: config.apiPrefix,
          appVersion: config.appVersion,
          nodeVersion: process.version,
        });

        if (process.env.NODE_ENV !== 'production') {
          console.log(`\n✅ ${config.appName} v${config.appVersion} 已启动`);
          console.log(`📍 地址: http://${host}:${port}`);
          console.log(`📚 API: http://${host}:${port}${config.apiPrefix}`);
          console.log(`🛠 环境: ${config.env}\n`);
        }
      });

      // 服务器错误处理
      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          serverLogger.error(`端口 ${port} 已被占用`);
          process.exit(1);
        } else {
          serverLogger.error('服务器错误:', { error: error.message });
        }
      });

    } catch (error) {
      logger.error('服务启动失败:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    }
  }

  /**
   * 优雅关闭
   */
  async gracefulShutdown(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }
    this.isShuttingDown = true;

    const shutdownLogger = createChildLogger('Shutdown');
    shutdownLogger.info('开始优雅关闭...');

    // 设置超时强制关闭
    const timeout = setTimeout(() => {
      shutdownLogger.warn('强制关闭服务器（超时）');
      process.exit(1);
    }, 30000);

    try {
      // 关闭HTTP服务器
      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server!.close(() => {
            shutdownLogger.info('HTTP服务器已关闭');
            resolve();
          });
        });
      }

      // 关闭数据库连接
      if (dataSource.isInitialized) {
        await dataSource.destroy();
        shutdownLogger.info('数据库连接已关闭');
      }

      // 清理日志轮转定时器
      // (已经在logrotate.config.ts中注册了清理)

      clearTimeout(timeout);
      shutdownLogger.info('服务已优雅关闭');
      process.exit(0);

    } catch (error) {
      clearTimeout(timeout);
      shutdownLogger.error('关闭过程中发生错误:', {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  }

  /**
   * 获取Express应用实例
   */
  getApp(): express.Application {
    return this.app;
  }
}

// 创建应用实例
const app = new Application();

// 启动应用
if (require.main === module) {
  app.start();
}

export default app;