/**
 * 全局错误处理
 * 统一错误码和响应格式
 */

// 定义错误码
const ErrorCodes = {
    VALIDATION_ERROR: 1001,
    UNAUTHORIZED: 1002,
    FORBIDDEN: 1003,
    NOT_FOUND: 1004,
    CONFLICT: 1005,
    INTERNAL_ERROR: 5000,
    DATABASE_ERROR: 5001,
    NETWORK_ERROR: 5002
};

// 错误消息映射
const ErrorMessages = {
    [ErrorCodes.VALIDATION_ERROR]: '数据验证失败',
    [ErrorCodes.UNAUTHORIZED]: '未授权',
    [ErrorCodes.FORBIDDEN]: '权限不足',
    [ErrorCodes.NOT_FOUND]: '资源不存在',
    [ErrorCodes.CONFLICT]: '资源冲突',
    [ErrorCodes.INTERNAL_ERROR]: '服务器内部错误',
    [ErrorCodes.DATABASE_ERROR]: '数据库错误',
    [ErrorCodes.NETWORK_ERROR]: '网络错误'
};

/**
 * 自定义错误类
 */
class AppError extends Error {
    constructor(message, code = ErrorCodes.INTERNAL_ERROR, statusCode = 500, details = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * 错误处理中间件
 */
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const code = err.code || ErrorCodes.INTERNAL_ERROR;
    const message = err.message || ErrorMessages[code] || '未知错误';

    // 记录错误日志
    console.error(`[Error] ${message}`, {
        code,
        statusCode,
        stack: err.stack,
        url: req.url,
        method: req.method,
        userId: req.user?.id
    });

    // 返回统一格式的错误响应
    res.status(statusCode).json({
        code,
        success: false,
        message,
        details: err.details || undefined,
        timestamp: new Date().toISOString(),
        // 开发环境下返回堆栈信息
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * 404处理中间件
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        code: ErrorCodes.NOT_FOUND,
        success: false,
        message: `路由不存在: ${req.method} ${req.url}`,
        timestamp: new Date().toISOString()
    });
}

/**
 * 异步处理包装器
 */
function asyncWrapper(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    ErrorCodes,
    ErrorMessages,
    AppError,
    errorHandler,
    notFoundHandler,
    asyncWrapper
};
