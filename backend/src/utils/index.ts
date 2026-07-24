/**
 * Utility Functions - 工具函数统一导出
 * 提供各种实用的辅助函数，包括字符串处理、日期格式化、对象操作、加密等
 */

import crypto from 'crypto';
import { Types } from 'mongoose';

// ============================================
// ID 和编码生成
// ============================================

/**
 * 生成随机 ID
 */
export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * 生成短 ID（8 位）
 */
export const generateShortId = (): string => {
  return crypto.randomBytes(4).toString('hex');
};

/**
 * 生成编码（带前缀）
 */
export const generateCode = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

/**
 * 生成 UUID
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * 生成订单号
 */
export const generateOrderNo = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${year}${month}${day}-${random}`;
};

/**
 * 生成发票号
 */
export const generateInvoiceNo = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${year}${month}-${sequence}`;
};

// ============================================
// 字符串处理
// ============================================

/**
 * 首字母大写
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 首字母小写
 */
export const uncapitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * 蛇形命名转驼峰
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * 驼峰转蛇形命名
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * 截断字符串
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * 移除多余空格
 */
export const normalizeSpaces = (str: string): string => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * 检查是否为空字符串
 */
export const isEmptyString = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 安全获取字符串
 */
export const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

// ============================================
// 对象处理
// ============================================

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 移除对象中的空值（null, undefined, 空字符串）
 */
export const removeEmptyValues = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  });
  return result;
};

/**
 * 对象字段选择
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result: Partial<Pick<T, K>> = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result as Pick<T, K>;
};

/**
 * 对象字段排除
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

/**
 * 对象合并（深度）
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      result[key as keyof T] = deepMerge(
        target[key as keyof T] as any,
        sourceValue as any
      );
    } else {
      result[key as keyof T] = sourceValue as any;
    }
  });
  return result;
};

/**
 * 安全访问对象属性
 */
export const safeGet = <T>(obj: any, path: string, defaultValue?: T): T => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue as T;
    }
    result = result[key];
  }
  return (result === undefined ? defaultValue : result) as T;
};

// ============================================
// 日期处理
// ============================================

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 获取日期范围
 */
export const getDateRange = (period: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return { start, end };
};

/**
 * 检查是否为有效日期
 */
export const isValidDate = (date: any): boolean => {
  if (date instanceof Date) return !isNaN(date.getTime());
  if (typeof date === 'string') return !isNaN(new Date(date).getTime());
  return false;
};

/**
 * 日期差（天）
 */
export const daysDiff = (date1: Date, date2: Date): number => {
  const diff = date2.getTime() - date1.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * 添加天数
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ============================================
// 数字处理
// ============================================

/**
 * 格式化金额
 */
export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * 百分比计算
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * 四舍五入
 */
export const round = (value: number, decimals: number = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

/**
 * 限值
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// ============================================
// 数组处理
// ============================================

/**
 * 数组分块
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * 数组去重
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * 数组分组
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * 数组排序
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================
// 其他工具
// ============================================

/**
 * 延迟执行
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 重试函数
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
};

/**
 * 检查是否为 MongoDB ObjectId
 */
export const isObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

/**
 * 清理对象（移除 null 和 undefined）
 */
export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      result[key as keyof T] = value;
    }
  });
  return result;
};

// ============================================
// 默认导出
// ============================================

export default {
  // ID 生成
  generateId,
  generateShortId,
  generateCode,
  generateUUID,
  generateOrderNo,
  generateInvoiceNo,

  // 字符串
  capitalize,
  uncapitalize,
  snakeToCamel,
  camelToSnake,
  truncate,
  normalizeSpaces,
  isEmptyString,
  safeString,

  // 对象
  deepClone,
  removeEmptyValues,
  pick,
  omit,
  deepMerge,
  safeGet,
  cleanObject,

  // 日期
  formatDate,
  getDateRange,
  isValidDate,
  daysDiff,
  addDays,

  // 数字
  formatCurrency,
  calculatePercentage,
  round,
  clamp,

  // 数组
  chunk,
  unique,
  groupBy,
  sortBy,

  // 其他
  sleep,
  retry,
  isObjectId
};