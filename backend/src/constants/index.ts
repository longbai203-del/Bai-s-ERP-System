/**
 * @file src/constants/index.ts
 * 全局常量定义
 */

// ============================================
// 系统常量
// ============================================

export const SYSTEM = {
  NAME: 'ERP System',
  VERSION: '1.0.0',
  AUTHOR: 'ERP System Team',
  LICENSE: 'MIT',
};

// ============================================
// HTTP 状态码
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// ============================================
// API 错误码
// ============================================

export const ERROR_CODES = {
  // 认证错误
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_FAILED: 'AUTH_FAILED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  REFRESH_EXPIRED: 'REFRESH_EXPIRED',
  
  // 权限错误
  FORBIDDEN_ROLE: 'FORBIDDEN_ROLE',
  FORBIDDEN_PERMISSION: 'FORBIDDEN_PERMISSION',
  
  // 验证错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // 资源错误
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // 业务错误
  BUSINESS_ERROR: 'BUSINESS_ERROR',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  CREDIT_EXCEEDED: 'CREDIT_EXCEEDED',
  ORDER_CANNOT_CANCEL: 'ORDER_CANNOT_CANCEL',
  
  // 系统错误
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// ============================================
// 环境变量
// ============================================

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type Environment = typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS];

// ============================================
// 日期格式
// ============================================

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MS: 'YYYY-MM-DD HH:mm:ss.SSS',
  TIME: 'HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  FILENAME: 'YYYYMMDD_HHmmss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;

// ============================================
// 缓存键
// ============================================

export const CACHE_KEYS = {
  USER: (id: string | number) => `user:${id}`,
  SESSION: (id: string) => `session:${id}`,
  CUSTOMER: (id: string | number) => `customer:${id}`,
  PRODUCT: (id: string | number) => `product:${id}`,
  ORDER: (id: string | number) => `order:${id}`,
  SETTINGS: (key: string) => `settings:${key}`,
  LIST: (prefix: string) => `list:${prefix}`,
  STATS: (type: string) => `stats:${type}`,
  RATE_LIMIT: (key: string) => `rate_limit:${key}`,
} as const;

// ============================================
// 默认分页
// ============================================

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'desc',
} as const;

// ============================================
// 文件类型
// ============================================

export const MIME_TYPES = {
  // 图片
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp',
  SVG: 'image/svg+xml',
  
  // 文档
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT: 'text/plain',
  
  // 数据
  JSON: 'application/json',
  XML: 'application/xml',
  CSV: 'text/csv',
  ZIP: 'application/zip',
  GZIP: 'application/gzip',
} as const;

export type MimeType = typeof MIME_TYPES[keyof typeof MIME_TYPES];

// ============================================
// 文件扩展名
// ============================================

export const FILE_EXTENSIONS = {
  JPEG: '.jpg',
  JPG: '.jpg',
  PNG: '.png',
  GIF: '.gif',
  WEBP: '.webp',
  SVG: '.svg',
  PDF: '.pdf',
  DOC: '.doc',
  DOCX: '.docx',
  XLS: '.xls',
  XLSX: '.xlsx',
  PPT: '.ppt',
  PPTX: '.pptx',
  TXT: '.txt',
  JSON: '.json',
  XML: '.xml',
  CSV: '.csv',
  ZIP: '.zip',
  GZ: '.gz',
} as const;

// ============================================
// 正则表达式
// ============================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  DATETIME: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  IP: /^(\d{1,3}\.){3}\d{1,3}$/,
  DOMAIN: /^([\w-]+\.)+[\w-]+$/,
} as const;

// ============================================
// 角色
// ============================================

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
  GUEST: 'guest',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ============================================
// 权限
// ============================================

export const PERMISSIONS = {
  // 客户管理
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',
  CUSTOMER_LIST: 'customer:list',
  CUSTOMER_EXPORT: 'customer:export',
  
  // 产品管理
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_LIST: 'product:list',
  PRODUCT_EXPORT: 'product:export',
  
  // 订单管理
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_LIST: 'order:list',
  ORDER_UPDATE_STATUS: 'order:update-status',
  
  // 财务管理
  FINANCE_INVOICE_CREATE: 'finance:invoice:create',
  FINANCE_INVOICE_READ: 'finance:invoice:read',
  FINANCE_INVOICE_UPDATE: 'finance:invoice:update',
  FINANCE_INVOICE_DELETE: 'finance:invoice:delete',
  FINANCE_INVOICE_LIST: 'finance:invoice:list',
  FINANCE_INVOICE_PAY: 'finance:invoice:pay',
  FINANCE_REPORTS: 'finance:reports',
  
  // 人力资源管理
  HR_EMPLOYEE_CREATE: 'hr:employee:create',
  HR_EMPLOYEE_READ: 'hr:employee:read',
  HR_EMPLOYEE_UPDATE: 'hr:employee:update',
  HR_EMPLOYEE_DELETE: 'hr:employee:delete',
  HR_EMPLOYEE_LIST: 'hr:employee:list',
  HR_ATTENDANCE_READ: 'hr:attendance:read',
  HR_ATTENDANCE_UPDATE: 'hr:attendance:update',
  HR_STATS: 'hr:stats',
  
  // 库存管理
  INVENTORY_ITEM_CREATE: 'inventory:item:create',
  INVENTORY_ITEM_READ: 'inventory:item:read',
  INVENTORY_ITEM_UPDATE: 'inventory:item:update',
  INVENTORY_ITEM_DELETE: 'inventory:item:delete',
  INVENTORY_ITEM_LIST: 'inventory:item:list',
  INVENTORY_STOCK_IN: 'inventory:stock:in',
  INVENTORY_STOCK_OUT: 'inventory:stock:out',
  INVENTORY_TRANSACTION_READ: 'inventory:transaction:read',
  INVENTORY_STATS: 'inventory:stats',
  
  // 系统设置
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_DELETE: 'settings:delete',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ============================================
// 排序方向
// ============================================

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];

// ============================================
// 日志级别
// ============================================

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly',
} as const;

export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

// ============================================
// 语言
// ============================================

export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  ZH_TW: 'zh-TW',
  EN_US: 'en-US',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// ============================================
// 消息模板
// ============================================

export const MESSAGES = {
  // 通用
  SUCCESS: '操作成功',
  FAILED: '操作失败',
  NOT_FOUND: '资源不存在',
  ALREADY_EXISTS: '资源已存在',
  INVALID_INPUT: '输入参数无效',
  UNAUTHORIZED: '请先登录',
  FORBIDDEN: '权限不足',
  
  // 业务
  CUSTOMER_CREATED: '客户创建成功',
  CUSTOMER_UPDATED: '客户更新成功',
  CUSTOMER_DELETED: '客户删除成功',
  ORDER_CREATED: '订单创建成功',
  ORDER_UPDATED: '订单更新成功',
  ORDER_CANCELLED: '订单已取消',
  ORDER_STATUS_UPDATED: '订单状态已更新',
  PRODUCT_CREATED: '产品创建成功',
  PRODUCT_UPDATED: '产品更新成功',
  PRODUCT_DELETED: '产品删除成功',
  INVENTORY_STOCK_IN: '入库成功',
  INVENTORY_STOCK_OUT: '出库成功',
  INVOICE_CREATED: '发票创建成功',
  INVOICE_PAID: '发票已支付',
  SETTINGS_SAVED: '设置已保存',
} as const;

export type MessageKey = keyof typeof MESSAGES;

// ============================================
// 导出所有常量
// ============================================

export default {
  SYSTEM,
  HTTP_STATUS,
  ERROR_CODES,
  ENVIRONMENTS,
  DATE_FORMATS,
  CACHE_KEYS,
  DEFAULT_PAGINATION,
  MIME_TYPES,
  FILE_EXTENSIONS,
  REGEX,
  ROLES,
  PERMISSIONS,
  SORT_ORDER,
  LOG_LEVELS,
  LANGUAGES,
  MESSAGES,
};