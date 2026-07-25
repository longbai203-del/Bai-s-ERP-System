/**
 * 分布式链路追踪
 * 支持请求追踪、Span管理、上下文传递
 * @module tracing
 */

import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

/**
 * 追踪上下文
 */
export interface TraceContext {
  /** 追踪ID */
  traceId: string;
  /** Span ID */
  spanId: string;
  /** 父Span ID */
  parentSpanId?: string;
  /** 请求ID */
  requestId?: string;
  /** 用户ID */
  userId?: string;
  /** 标签 */
  tags: Record<string, string>;
}

/**
 * Span数据
 */
export interface SpanData {
  /** Span ID */
  spanId: string;
  /** 父Span ID */
  parentSpanId?: string;
  /** 追踪ID */
  traceId: string;
  /** Span名称 */
  name: string;
  /** 开始时间 */
  startTime: Date;
  /** 结束时间 */
  endTime?: Date;
  /** 持续时间（毫秒） */
  duration?: number;
  /** 标签 */
  tags: Record<string, string>;
  /** 日志 */
  logs: Array<{
    time: Date;
    message: string;
    fields: Record<string, any>;
  }>;
  /** 状态 */
  status: {
    code: 'ok' | 'error';
    message?: string;
  };
  /** 请求信息 */
  request?: {
    method: string;
    path: string;
    query?: any;
    headers?: any;
    body?: any;
  };
  /** 响应信息 */
  response?: {
    statusCode: number;
    duration: number;
    body?: any;
  };
}

/**
 * 追踪配置
 */
export interface TracingConfig {
  /** 是否启用 */
  enabled?: boolean;
  /** 采样率 */
  samplingRate?: number;
  /** 最大Span数 */
  maxSpans?: number;
  /** 是否记录请求体 */
  logRequestBody?: boolean;
  /** 是否记录响应体 */
  logResponseBody?: boolean;
  /** 忽略的路径 */
  ignorePaths?: RegExp[];
  /** 敏感字段 */
  sensitiveFields?: string[];
}

/**
 * 默认追踪配置
 */
export const DEFAULT_TRACING_CONFIG: TracingConfig = {
  enabled: true,
  samplingRate: 1.0,
  maxSpans: 10000,
  logRequestBody: false,
  logResponseBody: false,
  ignorePaths: [/^\/health/, /^\/metrics/, /^\/favicon.ico/],
  sensitiveFields: ['password', 'token', 'secret', 'key', 'creditCard', 'cvv'],
};

/**
 * 追踪管理器
 */
export class TracingManager extends EventEmitter {
  private config: Required<TracingConfig>;
  private spans: Map<string, SpanData> = new Map();
  private traces: Map<string, SpanData[]> = new Map();
  private currentContexts: Map<string, TraceContext> = new Map();

  constructor(config: TracingConfig = {}) {
    super();
    this.config = {
      enabled: true,
      samplingRate: 1.0,
      maxSpans: 10000,
      logRequestBody: false,
      logResponseBody: false,
      ignorePaths: [],
      sensitiveFields: [],
      ...config,
    };
  }

  /**
   * 生成追踪ID
   */
  generateTraceId(): string {
    return `trace_${Date.now()}_${uuidv4().slice(0, 8)}`;
  }

  /**
   * 生成Span ID
   */
  generateSpanId(): string {
    return `span_${Date.now()}_${uuidv4().slice(0, 6)}`;
  }

  /**
   * 决定是否采样
   */
  shouldSample(): boolean {
    return Math.random() < this.config.samplingRate;
  }

  /**
   * 创建追踪上下文
   */
  createContext(options: {
    traceId?: string;
    parentSpanId?: string;
    userId?: string;
    requestId?: string;
    tags?: Record<string, string>;
  }): TraceContext {
    const traceId = options.traceId || this.generateTraceId();
    const spanId = this.generateSpanId();

    const context: TraceContext = {
      traceId,
      spanId,
      parentSpanId: options.parentSpanId,
      userId: options.userId,
      requestId: options.requestId || `req_${Date.now()}`,
      tags: options.tags || {},
    };

    this.currentContexts.set(spanId, context);
    return context;
  }

  /**
   * 获取当前上下文
   */
  getCurrentContext(spanId: string): TraceContext | null {
    return this.currentContexts.get(spanId) || null;
  }

  /**
   * 开始Span
   */
  startSpan(name: string, options: {
    traceId?: string;
    parentSpanId?: string;
    tags?: Record<string, string>;
    userId?: string;
    request?: {
      method: string;
      path: string;
      query?: any;
      headers?: any;
      body?: any;
    };
  }): SpanData {
    if (!this.config.enabled) {
      return {} as SpanData;
    }

    const traceId = options.traceId || this.generateTraceId();
    const spanId = this.generateSpanId();

    const span: SpanData = {
      spanId,
      parentSpanId: options.parentSpanId,
      traceId,
      name,
      startTime: new Date(),
      tags: {
        'trace.id': traceId,
        'span.id': spanId,
        ...options.tags,
      },
      logs: [],
      status: { code: 'ok' },
    };

    if (options.request) {
      const request = options.request;
      span.request = {
        method: request.method,
        path: request.path,
        query: request.query,
        headers: request.headers,
        body: this.config.logRequestBody ? this.sanitizeData(request.body) : undefined,
      };
      span.tags['http.method'] = request.method;
      span.tags['http.path'] = request.path;
    }

    if (options.userId) {
      span.tags['user.id'] = options.userId;
    }

    this.spans.set(spanId, span);

    // 添加到追踪
    if (!this.traces.has(traceId)) {
      this.traces.set(traceId, []);
    }
    this.traces.get(traceId)!.push(span);

    this.emit('span_started', span);

    return span;
  }

  /**
   * 结束Span
   */
  endSpan(spanId: string): SpanData | null {
    const span = this.spans.get(spanId);
    if (!span) return null;

    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();

    this.spans.set(spanId, span);
    this.emit('span_ended', span);

    // 清理上下文
    this.currentContexts.delete(spanId);

    return span;
  }

  /**
   * 添加Span日志
   */
  addSpanLog(spanId: string, message: string, fields: Record<string, any> = {}): boolean {
    const span = this.spans.get(spanId);
    if (!span) return false;

    span.logs.push({
      time: new Date(),
      message,
      fields: this.sanitizeData(fields),
    });

    this.emit('span_log_added', { spanId, message, fields });
    return true;
  }

  /**
   * 设置Span标签
   */
  setSpanTag(spanId: string, key: string, value: string): boolean {
    const span = this.spans.get(spanId);
    if (!span) return false;

    span.tags[key] = value;
    return true;
  }

  /**
   * 设置Span状态
   */
  setSpanStatus(spanId: string, code: 'ok' | 'error', message?: string): boolean {
    const span = this.spans.get(spanId);
    if (!span) return false;

    span.status = { code, message };
    return true;
  }

  /**
   * 记录Span错误
   */
  recordSpanError(spanId: string, error: Error): boolean {
    const span = this.spans.get(spanId);
    if (!span) return false;

    span.status = {
      code: 'error',
      message: error.message,
    };

    span.logs.push({
      time: new Date(),
      message: 'Error occurred',
      fields: {
        'error.message': error.message,
        'error.stack': error.stack,
        'error.name': error.name,
      },
    });

    this.emit('span_error', { spanId, error });
    return true;
  }

  /**
   * 敏感数据脱敏
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    if (typeof data === 'string') {
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
   * 获取追踪中间件
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.config.enabled) {
        return next();
      }

      // 检查是否忽略
      for (const pattern of this.config.ignorePaths) {
        if (pattern.test(req.path)) {
          return next();
        }
      }

      // 采样决定
      if (!this.shouldSample()) {
        return next();
      }

      // 从请求头获取追踪信息
      const traceId = (req.headers['x-trace-id'] as string) || this.generateTraceId();
      const parentSpanId = req.headers['x-parent-span-id'] as string;

      // 开始Span
      const span = this.startSpan(`http.${req.method.toLowerCase()}`, {
        traceId,
        parentSpanId,
        request: {
          method: req.method,
          path: req.path,
          query: req.query,
          headers: req.headers,
          body: req.body,
        },
        userId: (req as any).user?.id,
        tags: {
          'http.method': req.method,
          'http.path': req.path,
          'http.host': req.headers.host || '',
        },
      });

      // 设置响应头
      res.setHeader('X-Trace-ID', traceId);

      // 保存上下文
      const context: TraceContext = {
        traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        userId: (req as any).user?.id,
        requestId: `req_${Date.now()}`,
        tags: {},
      };
      this.currentContexts.set(span.spanId, context);

      // 将追踪信息挂载到请求对象
      (req as any).trace = {
        traceId,
        spanId: span.spanId,
        context,
      };

      // 劫持响应
      const originalEnd = res.end;
      res.end = (...args: any[]) => {
        // 记录响应信息
        span.response = {
          statusCode: res.statusCode,
          duration: Date.now() - span.startTime.getTime(),
          body: this.config.logResponseBody ? this.sanitizeData((res as any).body) : undefined,
        };
        span.tags['http.status'] = String(res.statusCode);
        span.tags['http.duration'] = String(span.response.duration);

        // 设置状态
        if (res.statusCode >= 400) {
          span.status = {
            code: 'error',
            message: `HTTP ${res.statusCode}`,
          };
        }

        // 结束Span
        this.endSpan(span.spanId);

        return originalEnd.apply(res, args as any);
      };

      next();
    };
  }

  /**
   * 获取Span
   */
  getSpan(spanId: string): SpanData | null {
    return this.spans.get(spanId) || null;
  }

  /**
   * 获取追踪
   */
  getTrace(traceId: string): SpanData[] {
    return this.traces.get(traceId) || [];
  }

  /**
   * 获取所有追踪
   */
  getAllTraces(): Record<string, SpanData[]> {
    const result: Record<string, SpanData[]> = {};
    for (const [traceId, spans] of this.traces) {
      result[traceId] = spans;
    }
    return result;
  }

  /**
   * 获取追踪树
   */
  getTraceTree(traceId: string): any {
    const spans = this.traces.get(traceId);
    if (!spans || spans.length === 0) return null;

    // 构建树
    const tree: any = {
      traceId,
      spans: [],
    };

    // 找根Span
    const rootSpans = spans.filter((s) => !s.parentSpanId);
    const childMap = new Map<string, SpanData[]>();

    for (const span of spans) {
      if (span.parentSpanId) {
        if (!childMap.has(span.parentSpanId)) {
          childMap.set(span.parentSpanId, []);
        }
        childMap.get(span.parentSpanId)!.push(span);
      }
    }

    const buildTree = (span: SpanData): any => {
      const node: any = {
        spanId: span.spanId,
        name: span.name,
        startTime: span.startTime,
        endTime: span.endTime,
        duration: span.duration,
        tags: span.tags,
        status: span.status,
        children: [],
      };

      const children = childMap.get(span.spanId) || [];
      for (const child of children) {
        node.children.push(buildTree(child));
      }

      return node;
    };

    for (const root of rootSpans) {
      tree.spans.push(buildTree(root));
    }

    return tree;
  }

  /**
   * 获取追踪统计
   */
  getStats(): Record<string, any> {
    let totalSpans = 0;
    let totalTraces = this.traces.size;
    let avgDuration = 0;
    let totalDuration = 0;

    for (const spans of this.traces.values()) {
      totalSpans += spans.length;
      for (const span of spans) {
        if (span.duration) {
          totalDuration += span.duration;
        }
      }
    }

    avgDuration = totalSpans > 0 ? totalDuration / totalSpans : 0;

    return {
      total_traces: totalTraces,
      total_spans: totalSpans,
      avg_duration_ms: avgDuration,
      active_spans: this.spans.size,
      max_spans: this.config.maxSpans,
      sampling_rate: this.config.samplingRate,
    };
  }

  /**
   * 清理旧追踪
   */
  cleanup(retentionHours: number = 24): void {
    const cutoffTime = Date.now() - retentionHours * 60 * 60 * 1000;

    for (const [traceId, spans] of this.traces) {
      const hasRecentSpan = spans.some((s) => s.startTime.getTime() > cutoffTime);
      if (!hasRecentSpan) {
        this.traces.delete(traceId);
      }
    }

    // 限制最大追踪数
    if (this.traces.size > this.config.maxSpans) {
      const sortedTraces = Array.from(this.traces.entries())
        .sort(([, a], [, b]) => {
          const aTime = Math.max(...a.map((s) => s.startTime.getTime()));
          const bTime = Math.max(...b.map((s) => s.startTime.getTime()));
          return aTime - bTime;
        });

      const toDelete = sortedTraces.slice(0, sortedTraces.length - this.config.maxSpans);
      for (const [traceId] of toDelete) {
        this.traces.delete(traceId);
      }
    }

    // 清理孤立Span
    for (const [spanId, span] of this.spans) {
      if (span.startTime.getTime() < cutoffTime) {
        this.spans.delete(spanId);
      }
    }
  }

  /**
   * 关闭追踪管理器
   */
  async close(): Promise<void> {
    this.spans.clear();
    this.traces.clear();
    this.currentContexts.clear();
  }
}

/**
 * 创建追踪管理器（工厂函数）
 */
export function createTracingManager(config?: TracingConfig): TracingManager {
  return new TracingManager(config);
}

export default TracingManager;