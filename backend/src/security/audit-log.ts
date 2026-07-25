/**
 * 审计日志系统
 * 记录所有关键操作、用户行为、系统事件，支持查询、导出和分析
 * @module audit-log
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

/**
 * 审计日志级别
 */
export enum AuditLogLevel {
  /** 信息 */
  INFO = 'info',
  /** 警告 */
  WARN = 'warn',
  /** 错误 */
  ERROR = 'error',
  /** 严重 */
  CRITICAL = 'critical',
}

/**
 * 审计日志操作类型
 */
export enum AuditActionType {
  // 认证相关
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  TOKEN_REFRESH = 'token_refresh',

  // 用户管理
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  USER_ACTIVATE = 'user_activate',
  USER_DEACTIVATE = 'user_deactivate',
  USER_ROLE_CHANGE = 'user_role_change',

  // 权限管理
  PERMISSION_CHANGE = 'permission_change',
  ROLE_CREATE = 'role_create',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',

  // 数据操作
  DATA_CREATE = 'data_create',
  DATA_UPDATE = 'data_update',
  DATA_DELETE = 'data_delete',
  DATA_VIEW = 'data_view',
  DATA_EXPORT = 'data_export',
  DATA_IMPORT = 'data_import',

  // 系统操作
  SYSTEM_START = 'system_start',
  SYSTEM_STOP = 'system_stop',
  SYSTEM_CONFIG_CHANGE = 'system_config_change',
  SYSTEM_BACKUP = 'system_backup',
  SYSTEM_RESTORE = 'system_restore',

  // 安全事件
  SECURITY_ALERT = 'security_alert',
  SECURITY_BLOCK = 'security_block',
  BRUTE_FORCE_ATTEMPT = 'brute_force_attempt',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',

  // 业务操作
  ORDER_CREATE = 'order_create',
  ORDER_UPDATE = 'order_update',
  ORDER_CANCEL = 'order_cancel',
  ORDER_COMPLETE = 'order_complete',
  PAYMENT_PROCESS = 'payment_process',
  PAYMENT_REFUND = 'payment_refund',
  INVENTORY_ADJUST = 'inventory_adjust',
  PRODUCT_CREATE = 'product_create',
  PRODUCT_UPDATE = 'product_update',
  PRODUCT_DELETE = 'product_delete',
  CUSTOMER_CREATE = 'customer_create',
  CUSTOMER_UPDATE = 'customer_update',
  CUSTOMER_DELETE = 'customer_delete',
}

/**
 * 审计日志条目接口
 */
export interface AuditLogEntry {
  /** 日志ID */
  id: string;
  /** 时间戳 */
  timestamp: Date;
  /** 用户ID */
  userId: string;
  /** 用户名 */
  username: string;
  /** 用户IP */
  ip: string;
  /** 用户代理 */
  userAgent: string;
  /** 操作类型 */
  actionType: AuditActionType;
  /** 操作描述 */
  description: string;
  /** 操作级别 */
  level: AuditLogLevel;
  /** 模块名称 */
  module: string;
  /** 资源ID（如果适用） */
  resourceId?: string;
  /** 资源类型 */
  resourceType?: string;
  /** 操作前数据 */
  beforeData?: any;
  /** 操作后数据 */
  afterData?: any;
  /** 请求详情 */
  request: {
    method: string;
    path: string;
    query?: any;
    body?: any;
    headers?: any;
  };
  /** 响应详情 */
  response?: {
    statusCode: number;
    duration: number;
    body?: any;
  };
  /** 错误信息 */
  error?: string;
  /** 额外元数据 */
  metadata?: Record<string, any>;
  /** 会话ID */
  sessionId?: string;
  /** 追踪ID */
  traceId?: string;
}

/**
 * 审计日志查询选项
 */
export interface AuditLogQueryOptions {
  /** 用户ID */
  userId?: string;
  /** 操作类型列表 */
  actionTypes?: AuditActionType[];
  /** 模块名称 */
  module?: string;
  /** 开始时间 */
  startDate?: Date;
  /** 结束时间 */
  endDate?: Date;
  /** 日志级别 */
  level?: AuditLogLevel;
  /** 搜索关键词 */
  keyword?: string;
  /** 资源ID */
  resourceId?: string;
  /** 分页页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortDirection?: 'asc' | 'desc';
}

/**
 * 审计日志查询结果
 */
export interface AuditLogQueryResult {
  /** 日志列表 */
  items: AuditLogEntry[];
  /** 总数 */
  total: number;
  /** 当前页 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 审计日志统计信息
 */
export interface AuditLogStats {
  /** 总日志数 */
  total: number;
  /** 各操作类型计数 */
  byActionType: Record<AuditActionType, number>;
  /** 各模块计数 */
  byModule: Record<string, number>;
  /** 各级别计数 */
  byLevel: Record<AuditLogLevel, number>;
  /** 每日计数 */
  byDay: Array<{ date: string; count: number }>;
  /** 每小时计数 */
  byHour: Array<{ hour: number; count: number }>;
}

/**
 * 审计日志存储接口
 */
export interface AuditLogStorage {
  /** 保存日志 */
  save(entry: AuditLogEntry): Promise<void>;
  /** 批量保存 */
  saveMany(entries: AuditLogEntry[]): Promise<void>;
  /** 查询日志 */
  query(options: AuditLogQueryOptions): Promise<AuditLogQueryResult>;
  /** 获取统计信息 */
  getStats(startDate?: Date, endDate?: Date): Promise<AuditLogStats>;
  /** 获取日志详情 */
  findById(id: string): Promise<AuditLogEntry | null>;
  /** 删除日志（清理） */
  deleteBefore(date: Date): Promise<number>;
}

/**
 * 审计日志配置
 */
export interface AuditLogConfig {
  /** 存储实现 */
  storage: AuditLogStorage;
  /** 是否启用 */
  enabled?: boolean;
  /** 记录请求体 */
  logRequestBody?: boolean;
  /** 记录响应体 */
  logResponseBody?: boolean;
  /** 敏感字段脱敏 */
  sensitiveFields?: string[];
  /** 默认日志级别 */
  defaultLevel?: AuditLogLevel;
  /** 保留天数 */
  retentionDays?: number;
}

/**
 * 审计日志管理器
 */
export class AuditLogManager extends EventEmitter {
  private config: Required<AuditLogConfig>;
  private buffer: AuditLogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor(config: AuditLogConfig) {
    super();
    this.config = {
      enabled: true,
      logRequestBody: true,
      logResponseBody: false,
      sensitiveFields: ['password', 'token', 'secret', 'key', 'creditCard', 'cvv'],
      defaultLevel: AuditLogLevel.INFO,
      retentionDays: 90,
      ...config,
    };

    this.startFlushTimer();
  }

  /**
   * 启动定时刷新
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, 5000); // 5秒刷新一次
  }

  /**
   * 敏感数据脱敏
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    if (typeof data === 'string') {
      // 检查是否是敏感字段值
      for (const field of this.config.sensitiveFields) {
        if (data.includes(field) || data.toLowerCase().includes(field.toLowerCase())) {
          return '***REDACTED***';
        }
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const isSensitive = this.config.sensitiveFields.some(
          (field) => key.toLowerCase().includes(field.toLowerCase())
        );
        sanitized[key] = isSensitive ? '***REDACTED***' : this.sanitizeData(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * 创建审计日志条目
   */
  private createEntry(params: {
    userId: string;
    username: string;
    ip: string;
    userAgent: string;
    actionType: AuditActionType;
    description: string;
    level?: AuditLogLevel;
    module: string;
    resourceId?: string;
    resourceType?: string;
    beforeData?: any;
    afterData?: any;
    request?: any;
    response?: any;
    error?: string;
    metadata?: Record<string, any>;
    sessionId?: string;
    traceId?: string;
  }): AuditLogEntry {
    const now = new Date();
    const request = params.request || { method: 'UNKNOWN', path: 'UNKNOWN' };

    // 脱敏处理
    const beforeData = params.beforeData ? this.sanitizeData(params.beforeData) : undefined;
    const afterData = params.afterData ? this.sanitizeData(params.afterData) : undefined;
    const requestBody = this.config.logRequestBody ? this.sanitizeData(request.body) : undefined;

    return {
      id: `audit_${Date.now()}_${uuidv4().slice(0, 8)}`,
      timestamp: now,
      userId: params.userId,
      username: params.username,
      ip: params.ip,
      userAgent: params.userAgent,
      actionType: params.actionType,
      description: params.description,
      level: params.level || this.config.defaultLevel,
      module: params.module,
      resourceId: params.resourceId,
      resourceType: params.resourceType,
      beforeData,
      afterData,
      request: {
        method: request.method,
        path: request.path,
        query: request.query,
        body: requestBody,
        headers: request.headers,
      },
      response: params.response
        ? {
            statusCode: params.response.statusCode,
            duration: params.response.duration,
            body: this.config.logResponseBody ? this.sanitizeData(params.response.body) : undefined,
          }
        : undefined,
      error: params.error,
      metadata: params.metadata,
      sessionId: params.sessionId,
      traceId: params.traceId || uuidv4(),
    };
  }

  /**
   * 记录审计日志
   */
  async log(params: {
    userId: string;
    username: string;
    ip: string;
    userAgent: string;
    actionType: AuditActionType;
    description: string;
    level?: AuditLogLevel;
    module: string;
    resourceId?: string;
    resourceType?: string;
    beforeData?: any;
    afterData?: any;
    request?: any;
    response?: any;
    error?: string;
    metadata?: Record<string, any>;
    sessionId?: string;
    traceId?: string;
  }): Promise<AuditLogEntry> {
    if (!this.config.enabled) {
      return null as any;
    }

    const entry = this.createEntry(params);

    // 触发日志事件
    this.emit('log', entry);

    // 如果是严重级别，立即刷新
    if (entry.level === AuditLogLevel.CRITICAL) {
      this.buffer.push(entry);
      await this.flush();
      return entry;
    }

    // 加入缓冲区
    this.buffer.push(entry);

    // 如果缓冲区超过100条，立即刷新
    if (this.buffer.length >= 100) {
      await this.flush();
    }

    return entry;
  }

  /**
   * 记录信息级别日志
   */
  async info(params: Omit<Parameters<typeof this.log>[0], 'level'>): Promise<AuditLogEntry> {
    return this.log({ ...params, level: AuditLogLevel.INFO });
  }

  /**
   * 记录警告级别日志
   */
  async warn(params: Omit<Parameters<typeof this.log>[0], 'level'>): Promise<AuditLogEntry> {
    return this.log({ ...params, level: AuditLogLevel.WARN });
  }

  /**
   * 记录错误级别日志
   */
  async error(params: Omit<Parameters<typeof this.log>[0], 'level'>): Promise<AuditLogEntry> {
    return this.log({ ...params, level: AuditLogLevel.ERROR });
  }

  /**
   * 记录严重级别日志
   */
  async critical(params: Omit<Parameters<typeof this.log>[0], 'level'>): Promise<AuditLogEntry> {
    return this.log({ ...params, level: AuditLogLevel.CRITICAL });
  }

  /**
   * 记录登录事件
   */
  async logLogin(params: {
    userId: string;
    username: string;
    ip: string;
    userAgent: string;
    success: boolean;
    error?: string;
    sessionId?: string;
  }): Promise<AuditLogEntry> {
    return this.log({
      userId: params.userId,
      username: params.username,
      ip: params.ip,
      userAgent: params.userAgent,
      actionType: params.success ? AuditActionType.LOGIN : AuditActionType.LOGIN_FAILED,
      description: params.success ? '用户登录成功' : '用户登录失败',
      level: params.success ? AuditLogLevel.INFO : AuditLogLevel.WARN,
      module: 'auth',
      error: params.error,
      sessionId: params.sessionId,
      metadata: {
        success: params.success,
      },
    });
  }

  /**
   * 记录数据操作事件
   */
  async logDataOperation(params: {
    userId: string;
    username: string;
    ip: string;
    userAgent: string;
    action: 'create' | 'update' | 'delete' | 'view';
    module: string;
    resourceType: string;
    resourceId: string;
    beforeData?: any;
    afterData?: any;
    description?: string;
  }): Promise<AuditLogEntry> {
    const actionMap = {
      create: AuditActionType.DATA_CREATE,
      update: AuditActionType.DATA_UPDATE,
      delete: AuditActionType.DATA_DELETE,
      view: AuditActionType.DATA_VIEW,
    };

    const levelMap = {
      create: AuditLogLevel.INFO,
      update: AuditLogLevel.INFO,
      delete: AuditLogLevel.WARN,
      view: AuditLogLevel.INFO,
    };

    const descriptionMap = {
      create: `创建${params.resourceType}`,
      update: `更新${params.resourceType}`,
      delete: `删除${params.resourceType}`,
      view: `查看${params.resourceType}`,
    };

    return this.log({
      userId: params.userId,
      username: params.username,
      ip: params.ip,
      userAgent: params.userAgent,
      actionType: actionMap[params.action],
      description: params.description || descriptionMap[params.action],
      level: levelMap[params.action],
      module: params.module,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      beforeData: params.beforeData,
      afterData: params.afterData,
    });
  }

  /**
   * 批量刷新缓冲区
   */
  async flush(): Promise<void> {
    if (this.isFlushing || this.buffer.length === 0) {
      return;
    }

    this.isFlushing = true;

    try {
      const entries = [...this.buffer];
      this.buffer = [];

      if (entries.length > 0) {
        await this.config.storage.saveMany(entries);
        this.emit('flush', { count: entries.length });
      }
    } catch (error) {
      console.error('[AuditLog] 刷新日志失败:', error);
      // 将日志重新加入缓冲区
      // 但为了避免无限循环，只保留最新的1000条
      this.buffer = [...entries, ...this.buffer].slice(0, 1000);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * 查询审计日志
   */
  async query(options: AuditLogQueryOptions): Promise<AuditLogQueryResult> {
    return this.config.storage.query(options);
  }

  /**
   * 获取日志详情
   */
  async findById(id: string): Promise<AuditLogEntry | null> {
    return this.config.storage.findById(id);
  }

  /**
   * 获取统计信息
   */
  async getStats(startDate?: Date, endDate?: Date): Promise<AuditLogStats> {
    return this.config.storage.getStats(startDate, endDate);
  }

  /**
   * 清理过期日志
   */
  async cleanup(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    return this.config.storage.deleteBefore(cutoffDate);
  }

  /**
   * 关闭审计日志管理器
   */
  async close(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.flush();
  }
}

/**
 * 内存存储实现（用于开发测试）
 */
export class MemoryAuditLogStorage implements AuditLogStorage {
  private logs: AuditLogEntry[] = [];

  async save(entry: AuditLogEntry): Promise<void> {
    this.logs.push(entry);
  }

  async saveMany(entries: AuditLogEntry[]): Promise<void> {
    this.logs.push(...entries);
  }

  async query(options: AuditLogQueryOptions): Promise<AuditLogQueryResult> {
    let result = [...this.logs];

    // 过滤
    if (options.userId) {
      result = result.filter((log) => log.userId === options.userId);
    }
    if (options.actionTypes && options.actionTypes.length > 0) {
      result = result.filter((log) => options.actionTypes!.includes(log.actionType));
    }
    if (options.module) {
      result = result.filter((log) => log.module === options.module);
    }
    if (options.level) {
      result = result.filter((log) => log.level === options.level);
    }
    if (options.resourceId) {
      result = result.filter((log) => log.resourceId === options.resourceId);
    }
    if (options.startDate) {
      result = result.filter((log) => log.timestamp >= options.startDate!);
    }
    if (options.endDate) {
      result = result.filter((log) => log.timestamp <= options.endDate!);
    }
    if (options.keyword) {
      const keyword = options.keyword.toLowerCase();
      result = result.filter(
        (log) =>
          log.description.toLowerCase().includes(keyword) ||
          log.username.toLowerCase().includes(keyword) ||
          (log.resourceId && log.resourceId.toLowerCase().includes(keyword))
      );
    }

    // 排序
    const sortBy = options.sortBy || 'timestamp';
    const sortDirection = options.sortDirection || 'desc';
    result.sort((a, b) => {
      const aVal = (a as any)[sortBy];
      const bVal = (b as any)[sortBy];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const total = result.length;
    const page = options.page || 1;
    const limit = options.limit || 20;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = result.slice(start, start + limit);

    return { items, total, page, limit, totalPages };
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<AuditLogStats> {
    let logs = this.logs;

    if (startDate) {
      logs = logs.filter((log) => log.timestamp >= startDate!);
    }
    if (endDate) {
      logs = logs.filter((log) => log.timestamp <= endDate!);
    }

    const stats: AuditLogStats = {
      total: logs.length,
      byActionType: {} as Record<AuditActionType, number>,
      byModule: {},
      byLevel: {
        [AuditLogLevel.INFO]: 0,
        [AuditLogLevel.WARN]: 0,
        [AuditLogLevel.ERROR]: 0,
        [AuditLogLevel.CRITICAL]: 0,
      },
      byDay: [],
      byHour: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
    };

    const dayMap = new Map<string, number>();

    logs.forEach((log) => {
      // 按操作类型
      stats.byActionType[log.actionType] = (stats.byActionType[log.actionType] || 0) + 1;

      // 按模块
      stats.byModule[log.module] = (stats.byModule[log.module] || 0) + 1;

      // 按级别
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // 按天
      const dayKey = log.timestamp.toISOString().split('T')[0];
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);

      // 按小时
      const hour = log.timestamp.getHours();
      stats.byHour[hour].count++;
    });

    stats.byDay = Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return stats;
  }

  async findById(id: string): Promise<AuditLogEntry | null> {
    return this.logs.find((log) => log.id === id) || null;
  }

  async deleteBefore(date: Date): Promise<number> {
    const initialLength = this.logs.length;
    this.logs = this.logs.filter((log) => log.timestamp >= date);
    return initialLength - this.logs.length;
  }
}

/**
 * 创建审计日志管理器实例（工厂函数）
 */
export function createAuditLogManager(config: AuditLogConfig): AuditLogManager {
  return new AuditLogManager(config);
}

export default AuditLogManager;