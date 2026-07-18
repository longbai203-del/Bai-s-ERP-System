/**
 * @file constants/index.ts
 * @description 全局常量定义
 */

// API 常量
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
}

// 应用常量
export const APP = {
  NAME: import.meta.env.VITE_APP_NAME || 'Bai\'s ERP',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENV: import.meta.env.VITE_APP_ENV || 'development'
}

// 状态常量
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DELETED: 'deleted'
}

// 订单状态
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已完成',
  cancelled: '已取消'
}

export const ORDER_STATUS_TYPES: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger'
}

// 用户角色
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
} as const

export const ROLE_LABELS: Record<string, string> = {
  admin: '管理员',
  manager: '经理',
  user: '普通用户'
}

// 支付方式
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  WECHAT: 'wechat',
  ALIPAY: 'alipay'
} as const

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: '现金',
  card: '银行卡',
  transfer: '转账',
  wechat: '微信支付',
  alipay: '支付宝'
}

// 本地存储键
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  LANGUAGE: 'language'
}

// 错误码
export const ERROR_CODES = {
  SUCCESS: 0,
  VALIDATION_ERROR: 1001,
  UNAUTHORIZED: 1002,
  FORBIDDEN: 1003,
  NOT_FOUND: 1004,
  CONFLICT: 1005,
  INTERNAL_ERROR: 5000,
  DATABASE_ERROR: 5001,
  NETWORK_ERROR: 5002
}

export const ERROR_MESSAGES: Record<number, string> = {
  [ERROR_CODES.SUCCESS]: '操作成功',
  [ERROR_CODES.VALIDATION_ERROR]: '数据验证失败',
  [ERROR_CODES.UNAUTHORIZED]: '未授权，请重新登录',
  [ERROR_CODES.FORBIDDEN]: '权限不足',
  [ERROR_CODES.NOT_FOUND]: '资源不存在',
  [ERROR_CODES.CONFLICT]: '资源冲突',
  [ERROR_CODES.INTERNAL_ERROR]: '服务器内部错误',
  [ERROR_CODES.DATABASE_ERROR]: '数据库错误',
  [ERROR_CODES.NETWORK_ERROR]: '网络错误'
}

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100]
}
