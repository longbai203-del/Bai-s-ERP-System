/**
 * 指标收集模块
 * 支持性能指标、业务指标、自定义指标
 * @module metrics
 */

import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';

/**
 * 指标类型
 */
export enum MetricType {
  /** 计数器 */
  COUNTER = 'counter',
  /** 计量器 */
  GAUGE = 'gauge',
  /** 直方图 */
  HISTOGRAM = 'histogram',
  /** 摘要 */
  SUMMARY = 'summary',
}

/**
 * 指标配置
 */
export interface MetricConfig {
  /** 指标名称 */
  name: string;
  /** 指标类型 */
  type: MetricType;
  /** 指标描述 */
  description?: string;
  /** 标签 */
  labels?: Record<string, string>;
}

/**
 * 指标数据
 */
export interface MetricData {
  /** 指标名称 */
  name: string;
  /** 指标类型 */
  type: MetricType;
  /** 指标值 */
  value: number;
  /** 标签 */
  labels: Record<string, string>;
  /** 时间戳 */
  timestamp: Date;
}

/**
 * 指标收集器
 */
export class MetricsCollector extends EventEmitter {
  private metrics: Map<string, MetricData[]> = new Map();
  private gauges: Map<string, { value: number; labels: Record<string, string> }> = new Map();
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  constructor() {
    super();
    this.registerDefaultMetrics();
  }

  /**
   * 注册默认指标
   */
  private registerDefaultMetrics(): void {
    // 记录进程启动时间
    this.registerGauge('process_start_time', Date.now() / 1000, {});
    this.registerGauge('process_uptime', process.uptime(), {});
  }

  /**
   * 注册计数器
   */
  registerCounter(name: string, labels: Record<string, string> = {}): void {
    const key = this.getKey(name, labels);
    if (!this.counters.has(key)) {
      this.counters.set(key, 0);
    }
  }

  /**
   * 增加计数器
   */
  incrementCounter(name: string, labels: Record<string, string> = {}, value: number = 1): void {
    const key = this.getKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    this.emit('metric', {
      name,
      type: MetricType.COUNTER,
      value: current + value,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * 注册计量器
   */
  registerGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, { value, labels });
  }

  /**
   * 设置计量器值
   */
  setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, { value, labels });

    this.emit('metric', {
      name,
      type: MetricType.GAUGE,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  /**
   * 注册直方图
   */
  registerHistogram(name: string): void {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, []);
    }
  }

  /**
   * 记录直方图值
   */
  observeHistogram(name: string, value: number): void {
    const values = this.histograms.get(name) || [];
    values.push(value);
    if (values.length > 10000) {
      values.shift();
    }
    this.histograms.set(name, values);

    this.emit('metric', {
      name,
      type: MetricType.HISTOGRAM,
      value,
      labels: {},
      timestamp: new Date(),
    });
  }

  /**
   * 获取键名
   */
  private getKey(name: string, labels: Record<string, string>): string {
    const labelString = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    return labelString ? `${name}{${labelString}}` : name;
  }

  /**
   * 获取所有指标
   */
  getMetrics(): MetricData[] {
    const results: MetricData[] = [];
    const now = new Date();

    // 计数器
    for (const [key, value] of this.counters) {
      const { name, labels } = this.parseKey(key);
      results.push({
        name,
        type: MetricType.COUNTER,
        value,
        labels,
        timestamp: now,
      });
    }

    // 计量器
    for (const [key, { value, labels }] of this.gauges) {
      const { name } = this.parseKey(key);
      results.push({
        name,
        type: MetricType.GAUGE,
        value,
        labels,
        timestamp: now,
      });
    }

    // 直方图
    for (const [name, values] of this.histograms) {
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);
        results.push({
          name: `${name}_count`,
          type: MetricType.COUNTER,
          value: values.length,
          labels: {},
          timestamp: now,
        });
        results.push({
          name: `${name}_sum`,
          type: MetricType.COUNTER,
          value: sum,
          labels: {},
          timestamp: now,
        });
        // 百分位数
        const p50 = sorted[Math.floor(sorted.length * 0.5)];
        const p90 = sorted[Math.floor(sorted.length * 0.9)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const p99 = sorted[Math.floor(sorted.length * 0.99)];
        results.push({ name: `${name}_p50`, type: MetricType.GAUGE, value: p50, labels: {}, timestamp: now });
        results.push({ name: `${name}_p90`, type: MetricType.GAUGE, value: p90, labels: {}, timestamp: now });
        results.push({ name: `${name}_p95`, type: MetricType.GAUGE, value: p95, labels: {}, timestamp: now });
        results.push({ name: `${name}_p99`, type: MetricType.GAUGE, value: p99, labels: {}, timestamp: now });
        results.push({ name: `${name}_max`, type: MetricType.GAUGE, value: sorted[sorted.length - 1], labels: {}, timestamp: now });
        results.push({ name: `${name}_min`, type: MetricType.GAUGE, value: sorted[0], labels: {}, timestamp: now });
      }
    }

    return results;
  }

  /**
   * 解析键名
   */
  private parseKey(key: string): { name: string; labels: Record<string, string> } {
    const match = key.match(/^([^{]+)(?:{([^}]+)})?$/);
    if (match) {
      const name = match[1];
      const labels: Record<string, string> = {};
      if (match[2]) {
        match[2].split(',').forEach((part) => {
          const [k, v] = part.split(':');
          if (k && v) {
            labels[k.trim()] = v.trim();
          }
        });
      }
      return { name, labels };
    }
    return { name: key, labels: {} };
  }

  /**
   * 重置所有指标
   */
  resetAll(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.registerDefaultMetrics();
  }

  /**
   * 重置特定指标
   */
  resetMetric(name: string): void {
    for (const [key] of this.counters) {
      if (key.startsWith(name)) {
        this.counters.delete(key);
      }
    }
    for (const [key] of this.gauges) {
      if (key.startsWith(name)) {
        this.gauges.delete(key);
      }
    }
    this.histograms.delete(name);
  }

  /**
   * 获取HTTP请求中间件
   */
  getHTTPMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();

      // 请求计数
      this.incrementCounter('http_requests_total', {
        method: req.method,
        path: req.path,
      });

      // 响应完成后记录
      const originalEnd = res.end;
      res.end = (...args: any[]) => {
        const duration = Date.now() - startTime;

        // 请求耗时
        this.observeHistogram('http_request_duration_seconds', duration / 1000);

        // 状态码计数
        this.incrementCounter('http_responses_total', {
          method: req.method,
          path: req.path,
          status: String(res.statusCode),
        });

        // 活跃请求数（计量器）
        this.setGauge('http_requests_active', 0, {
          method: req.method,
          path: req.path,
        });

        return originalEnd.apply(res, args as any);
      };

      // 活跃请求数
      this.setGauge('http_requests_active', 1, {
        method: req.method,
        path: req.path,
      });

      next();
    };
  }

  /**
   * 获取Prometheus格式指标
   */
  getPrometheusMetrics(): string {
    const metrics = this.getMetrics();
    const lines: string[] = [];

    // 分组指标
    const grouped: Record<string, MetricData[]> = {};
    for (const metric of metrics) {
      if (!grouped[metric.name]) {
        grouped[metric.name] = [];
      }
      grouped[metric.name].push(metric);
    }

    for (const [name, data] of Object.entries(grouped)) {
      // 确定类型
      const type = data[0].type;
      const typeString = type === MetricType.COUNTER ? 'counter' :
                         type === MetricType.GAUGE ? 'gauge' :
                         type === MetricType.HISTOGRAM ? 'histogram' : 'summary';

      lines.push(`# HELP ${name} ${name} metric`);
      lines.push(`# TYPE ${name} ${typeString}`);

      for (const item of data) {
        const labelString = Object.entries(item.labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',');
        const line = labelString ? `${name}{${labelString}} ${item.value}` : `${name} ${item.value}`;
        lines.push(line);
      }
    }

    return lines.join('\n');
  }

  /**
   * 获取JSON格式指标
   */
  getJSONMetrics(): Record<string, any> {
    const metrics = this.getMetrics();
    const result: Record<string, any> = {};

    for (const metric of metrics) {
      const key = metric.name;
      if (!result[key]) {
        result[key] = {
          type: metric.type,
          values: [],
        };
      }
      result[key].values.push({
        value: metric.value,
        labels: metric.labels,
        timestamp: metric.timestamp.toISOString(),
      });
    }

    return result;
  }

  /**
   * 获取指标统计
   */
  getStats(): Record<string, any> {
    const metrics = this.getMetrics();
    const stats: Record<string, any> = {
      total_metrics: metrics.length,
      by_type: {
        [MetricType.COUNTER]: 0,
        [MetricType.GAUGE]: 0,
        [MetricType.HISTOGRAM]: 0,
        [MetricType.SUMMARY]: 0,
      },
      last_updated: new Date().toISOString(),
    };

    for (const metric of metrics) {
      stats.by_type[metric.type] = (stats.by_type[metric.type] || 0) + 1;
    }

    return stats;
  }
}

/**
 * 创建指标收集器（工厂函数）
 */
export function createMetricsCollector(): MetricsCollector {
  return new MetricsCollector();
}

export default MetricsCollector;