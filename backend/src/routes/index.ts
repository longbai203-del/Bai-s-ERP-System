/**
 * 路由主入口
 * 聚合所有模块路由并应用全局中间件
 * 提供完整的 API 路由管理
 */

import { Router, Request, Response, NextFunction } from 'express';
import customerRoutes from './customer.routes';
import financeRoutes from './finance.routes';
import hrRoutes from './hr.routes';
import inventoryRoutes from './inventory.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import settingsRoutes from './settings.routes';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { rateLimiter, strictRateLimiter, authRateLimiter } from '../middlewares/rate-limit.middleware';
import { asyncHandler, notFoundHandler, errorHandler } from '../middlewares/error.middleware';
import { loggerMiddleware } from '../middlewares/logger.middleware';
import { corsMiddleware } from '../middlewares/cors.middleware';
import { helmetMiddleware } from '../middlewares/helmet.middleware';
import { compressionMiddleware } from '../middlewares/compression.middleware';

const router = Router();

// ============================================
// 全局中间件
// ============================================

// 安全中间件
router.use(helmetMiddleware);

// CORS 中间件
router.use(corsMiddleware);

// 压缩中间件
router.use(compressionMiddleware);

// 日志中间件
router.use(loggerMiddleware);

// 请求解析
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// 公开端点（无认证）
// ============================================

/**
 * GET /api/health
 * 健康检查 - 用于负载均衡和监控
 */
router.get(
  '/health',
  (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      message: 'ERP System API is running!'
    });
  }
);

/**
 * GET /api/info
 * API 信息
 */
router.get(
  '/info',
  (req: Request, res: Response) => {
    res.json({
      name: 'ERP System API',
      version: '3.0.0',
      description: 'Enterprise Resource Planning System Backend API',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      features: [
        'Customer Management',
        'Order Management',
        'Product Management',
        'Inventory Management',
        'Financial Management',
        'HR Management',
        'System Settings'
      ],
      documentation: '/api/docs',
      health: '/api/health'
    });
  }
);

/**
 * GET /api/test
 * 测试端点
 */
router.get(
  '/test',
  (req: Request, res: Response) => {
    res.json({
      message: 'API is working!',
      time: new Date().toISOString(),
      query: req.query,
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for']
      }
    });
  }
);

/**
 * GET /api/ping
 * 简单 Ping 测试
 */
router.get(
  '/ping',
  (req: Request, res: Response) => {
    res.status(200).send('pong');
  }
);

/**
 * GET /api/status
 * 系统状态
 */
router.get(
  '/status',
  asyncHandler(async (req: Request, res: Response) => {
    const dbStatus = await checkDatabaseConnection();
    res.json({
      status: 'operational',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      services: {
        api: 'running',
        database: dbStatus ? 'connected' : 'disconnected'
      }
    });
  })
);

// ============================================
// 模块路由注册
// ============================================

/**
 * 客户模块路由
 * 前缀: /api/customers
 * 限流: 基础限流
 * 认证: 部分路由需要认证
 */
router.use('/customers', rateLimiter, customerRoutes);

/**
 * 财务模块路由
 * 前缀: /api/finance
 * 限流: 严格限流（敏感数据）
 * 认证: 大部分路由需要认证
 */
router.use('/finance', strictRateLimiter, financeRoutes);

/**
 * HR 模块路由
 * 前缀: /api/hr
 * 限流: 基础限流
 * 认证: 大部分路由需要认证
 */
router.use('/hr', rateLimiter, hrRoutes);

/**
 * 库存模块路由
 * 前缀: /api/inventory
 * 限流: 基础限流
 * 认证: 大部分路由需要认证
 */
router.use('/inventory', rateLimiter, inventoryRoutes);

/**
 * 订单模块路由
 * 前缀: /api/orders
 * 限流: 基础限流
 * 认证: 大部分路由需要认证
 */
router.use('/orders', rateLimiter, orderRoutes);

/**
 * 产品模块路由
 * 前缀: /api/products
 * 限流: 基础限流
 * 认证: 大部分路由需要认证
 */
router.use('/products', rateLimiter, productRoutes);

/**
 * 设置模块路由
 * 前缀: /api/settings
 * 限流: 严格限流（敏感配置）
 * 认证: 全部需要认证
 */
router.use('/settings', strictRateLimiter, settingsRoutes);

// ============================================
// API 文档路由（可选）
// ============================================

/**
 * GET /api/docs
 * API 文档重定向
 */
router.get(
  '/docs',
  (req: Request, res: Response) => {
    res.redirect('/api-docs');
  }
);

/**
 * GET /api/docs/swagger.json
 * Swagger JSON 文档
 */
router.get(
  '/docs/swagger.json',
  (req: Request, res: Response) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'ERP System API',
        version: '3.0.0',
        description: 'Enterprise Resource Planning System API'
      },
      paths: {
        '/api/health': {
          get: {
            summary: 'Health Check',
            responses: {
              200: { description: 'OK' }
            }
          }
        }
      }
    });
  }
);

// ============================================
// 404 处理
// ============================================

/**
 * 404 Not Found 处理
 * 捕获所有未匹配的路由
 */
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
});

// ============================================
// 错误处理（由全局 errorHandler 接管）
// ============================================

/**
 * 错误处理中间件
 * 注意：此中间件必须在所有路由之后注册
 * 由 middleware/error.middleware.ts 中的 errorHandler 统一处理
 */

// 辅助函数
async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // 实际数据库连接检查
    // 这里只是一个示例
    return true;
  } catch (error) {
    return false;
  }
}

export default router;