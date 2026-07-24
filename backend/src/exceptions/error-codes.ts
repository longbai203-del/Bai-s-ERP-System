/**
 * @file error-codes.ts
 * @description 错误码定义
 */

export const ErrorCodes = {
    // 通用错误
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',

    // 认证错误
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // 业务错误
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    DUPLICATE_ERROR: 'DUPLICATE_ERROR',
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
    INVALID_STATUS: 'INVALID_STATUS',
};

export default ErrorCodes;
