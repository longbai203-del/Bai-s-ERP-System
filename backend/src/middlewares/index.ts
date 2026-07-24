/**
 * @file Middleware/index.ts
 * 中间件统一导出 - 按执行顺序统一管理
 */

// ============================================
// 导入所有中间件
// ============================================

import authMiddleware, {
  authMiddleware as auth,
  optionalAuth,
  adminAuth,
  requirePermission,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from './auth.middleware';

import errorHandlerMiddleware, {
  errorHandlerMiddleware as errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  DatabaseError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  BusinessError,
  RateLimitError,
  errorUtils,
} from './error-handler.middleware';

import validationMiddleware, {
  Validator,
  validate,
  validateAll,
  sanitize,
  validationUtils,
} from './validation.middleware';

// ============================================
// 中间件执行顺序（按依赖关系排列）
// ============================================

/**
 * 中间件执行顺序常量
 * 1. 请求追踪 (TraceId)
 * 2. 日志记录 (Morgan)
 * 3. 安全头 (Helmet)
 * 4. CORS
 * 5. 压缩 (Compression)
 * 6. 解析器 (Body Parser, Cookie Parser)
 * 7. 速率限制 (Rate Limit)
 * 8. 认证 (Auth)
 * 9. 验证 (Validation)
 * 10. 业务处理 (Routes)
 * 11. 错误处理 (Error Handler)
 * 12. 404处理 (Not Found)
 */
export const MIDDLEWARE_ORDER = [
  'traceId',
  'logger',
  'helmet',
  'cors',
  'compression',
  'bodyParser',
  'cookieParser',
  'rateLimit',
  'auth',
  'validation',
  'routes',
  'errorHandler',
  'notFound',
] as const;

// ============================================
// 导出所有中间件
// ============================================

export {
  // 认证中间件
  authMiddleware,
  auth,
  optionalAuth,
  adminAuth,
  requirePermission,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,

  // 错误处理中间件
  errorHandlerMiddleware,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  DatabaseError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  BusinessError,
  RateLimitError,
  errorUtils,

  // 验证中间件
  validationMiddleware,
  Validator,
  validate,
  validateAll,
  sanitize,
  validationUtils,
};

// ============================================
// 中间件工具函数
// ============================================

export const middlewareUtils = {
  /**
   * 获取中间件执行顺序
   */
  getOrder(): readonly string[] {
    return MIDDLEWARE_ORDER;
  },

  /**
   * 检查中间件是否按正确顺序排列
   */
  validateOrder(order: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const expected = [...MIDDLEWARE_ORDER];

    // 检查是否包含所有必需的中间件
    for (const name of expected) {
      if (!order.includes(name)) {
        errors.push(`缺少必需的中间件: ${name}`);
      }
    }

    // 检查顺序是否正确
    let lastIndex = -1;
    for (const name of order) {
      if (expected.includes(name)) {
        const currentIndex = expected.indexOf(name);
        if (currentIndex < lastIndex) {
          errors.push(`中间件 "${name}" 顺序错误，应在 "${expected[lastIndex]}" 之后`);
        }
        lastIndex = currentIndex;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * 获取中间件名称列表
   */
  getMiddlewareNames(): string[] {
    return [
      'authMiddleware',
      'optionalAuth',
      'adminAuth',
      'requirePermission',
      'errorHandlerMiddleware',
      'notFoundHandler',
      'asyncHandler',
      'Validator',
      'validate',
      'validateAll',
    ];
  },
};

// ============================================
// 中间件工厂 - 统一管理中间件实例
// ============================================

export class MiddlewareFactory {
  private static instance: MiddlewareFactory;
  private middlewareMap: Map<string, any> = new Map();

  private constructor() {
    // 注册所有中间件
    this.middlewareMap.set('auth', auth);
    this.middlewareMap.set('optionalAuth', optionalAuth);
    this.middlewareMap.set('adminAuth', adminAuth);
    this.middlewareMap.set('errorHandler', errorHandler);
    this.middlewareMap.set('notFound', notFoundHandler);
    this.middlewareMap.set('asyncHandler', asyncHandler);
  }

  static getInstance(): MiddlewareFactory {
    if (!MiddlewareFactory.instance) {
      MiddlewareFactory.instance = new MiddlewareFactory();
    }
    return MiddlewareFactory.instance;
  }

  /**
   * 获取中间件
   */
  getMiddleware<T>(name: string): T {
    const middleware = this.middlewareMap.get(name);
    if (!middleware) {
      throw new Error(`中间件 "${name}" 未注册`);
    }
    return middleware as T;
  }

  /**
   * 获取所有中间件名称
   */
  getMiddlewareNames(): string[] {
    return Array.from(this.middlewareMap.keys());
  }

  /**
   * 检查中间件是否已注册
   */
  hasMiddleware(name: string): boolean {
    return this.middlewareMap.has(name);
  }

  /**
   * 注册新中间件
   */
  registerMiddleware(name: string, middleware: any): void {
    if (this.middlewareMap.has(name)) {
      throw new Error(`中间件 "${name}" 已存在`);
    }
    this.middlewareMap.set(name, middleware);
  }
}

// ============================================
// 导出中间件工厂单例
// ============================================

export const middlewareFactory = MiddlewareFactory.getInstance();

// ============================================
// 默认导出
// ============================================

export default {
  auth: auth,
  optionalAuth,
  adminAuth,
  requirePermission,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  Validator,
  validate,
  validateAll,
  factory: middlewareFactory,
  utils: middlewareUtils,
};