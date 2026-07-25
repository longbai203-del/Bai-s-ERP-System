/**
 * 告警系统
 * 支持告警规则、多渠道通知、告警级别管理
 * @module alerting
 */

import { EventEmitter } from 'events';

/**
 * 告警级别
 */
export enum AlertSeverity {
  /** 信息 */
  INFO = 'info',
  /** 警告 */
  WARNING = 'warning',
  /** 错误 */
  ERROR = 'error',
  /** 严重 */
  CRITICAL = 'critical',
  /** 紧急 */
  EMERGENCY = 'emergency',
}

/**
 * 告警状态
 */
export enum AlertStatus {
  /** 活跃 */
  ACTIVE = 'active',
  /** 已解决 */
  RESOLVED = 'resolved',
  /** 已确认 */
  ACKNOWLEDGED = 'acknowledged',
  /** 已静音 */
  MUTED = 'muted',
}

/**
 * 告警通道类型
 */
export enum AlertChannelType {
  /** 控制台 */
  CONSOLE = 'console',
  /** 邮件 */
  EMAIL = 'email',
  /** 短信 */
  SMS = 'sms',
  /** Slack */
  SLACK = 'slack',
  /** Webhook */
  WEBHOOK = 'webhook',
  /** 企业微信 */
  WECHAT = 'wechat',
  /** 钉钉 */
  DINGTALK = 'dingtalk',
}

/**
 * 告警规则
 */
export interface AlertRule {
  /** 规则ID */
  id: string;
  /** 规则名称 */
  name: string;
  /** 规则描述 */
  description: string;
  /** 告警级别 */
  severity: AlertSeverity;
  /** 条件表达式 */
  condition: string;
  /** 评估间隔（秒） */
  interval: number;
  /** 持续时间（秒） */
  for?: number;
  /** 告警通道 */
  channels: AlertChannelType[];
  /** 是否启用 */
  enabled: boolean;
  /** 标签 */
  labels: Record<string, string>;
  /** 注释 */
  annotations: Record<string, string>;
}

/**
 * 告警实例
 */
export interface Alert {
  /** 告警ID */
  id: string;
  /** 规则ID */
  ruleId: string;
  /** 告警名称 */
  name: string;
  /** 告警级别 */
  severity: AlertSeverity;
  /** 告警状态 */
  status: AlertStatus;
  /** 告警消息 */
  message: string;
  /** 告警时间 */
  timestamp: Date;
  /** 解决时间 */
  resolvedAt?: Date;
  /** 确认时间 */
  acknowledgedAt?: Date;
  /** 确认人 */
  acknowledgedBy?: string;
  /** 标签 */
  labels: Record<string, string>;
  /** 注释 */
  annotations: Record<string, string>;
  /** 告警值 */
  value?: any;
}

/**
 * 告警通道配置
 */
export interface AlertChannelConfig {
  /** 通道类型 */
  type: AlertChannelType;
  /** 通道名称 */
  name: string;
  /** 配置参数 */
  config: Record<string, any>;
  /** 是否启用 */
  enabled: boolean;
}

/**
 * 告警配置
 */
export interface AlertConfig {
  /** 是否启用 */
  enabled?: boolean;
  /** 规则列表 */
  rules?: AlertRule[];
  /** 通道配置 */
  channels?: AlertChannelConfig[];
  /** 最大告警数 */
  maxAlerts?: number;
  /** 告警保留天数 */
  retentionDays?: number;
}

/**
 * 默认告警规则
 */
export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'high_cpu_usage',
    name: 'CPU使用率过高',
    description: 'CPU使用率超过80%',
    severity: AlertSeverity.WARNING,
    condition: 'cpu_usage > 80',
    interval: 60,
    for: 120,
    channels: [AlertChannelType.CONSOLE, AlertChannelType.EMAIL],
    enabled: true,
    labels: { category: 'system' },
    annotations: { summary: 'CPU使用率过高' },
  },
  {
    id: 'high_memory_usage',
    name: '内存使用率过高',
    description: '内存使用率超过85%',
    severity: AlertSeverity.WARNING,
    condition: 'memory_usage > 85',
    interval: 60,
    for: 120,
    channels: [AlertChannelType.CONSOLE, AlertChannelType.EMAIL],
    enabled: true,
    labels: { category: 'system' },
    annotations: { summary: '内存使用率过高' },
  },
  {
    id: 'service_down',
    name: '服务不可用',
    description: '服务健康检查失败',
    severity: AlertSeverity.CRITICAL,
    condition: 'health_status == "unhealthy"',
    interval: 30,
    for: 60,
    channels: [AlertChannelType.CONSOLE, AlertChannelType.EMAIL, AlertChannelType.SLACK],
    enabled: true,
    labels: { category: 'service' },
    annotations: { summary: '服务不可用' },
  },
  {
    id: 'error_rate_high',
    name: '错误率过高',
    description: '请求错误率超过5%',
    severity: AlertSeverity.ERROR,
    condition: 'error_rate > 5',
    interval: 60,
    for: 180,
    channels: [AlertChannelType.CONSOLE, AlertChannelType.EMAIL],
    enabled: true,
    labels: { category: 'application' },
    annotations: { summary: '错误率过高' },
  },
  {
    id: 'response_time_slow',
    name: '响应时间过慢',
    description: '平均响应时间超过2秒',
    severity: AlertSeverity.WARNING,
    condition: 'response_time_p95 > 2000',
    interval: 60,
    for: 300,
    channels: [AlertChannelType.CONSOLE],
    enabled: true,
    labels: { category: 'performance' },
    annotations: { summary: '响应时间过慢' },
  },
];

/**
 * 告警管理器
 */
export class AlertManager extends EventEmitter {
  private config: Required<AlertConfig>;
  private rules: Map<string, AlertRule> = new Map();
  private channels: Map<string, AlertChannelConfig> = new Map();
  private alerts: Alert[] = [];
  private alertHistory: Alert[] = [];
  private evaluationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: AlertConfig = {}) {
    super();
    this.config = {
      enabled: true,
      rules: [],
      channels: [],
      maxAlerts: 1000,
      retentionDays: 30,
      ...config,
    };

    // 加载默认规则
    DEFAULT_ALERT_RULES.forEach((rule) => {
      this.rules.set(rule.id, rule);
    });

    // 加载默认通道
    this.registerDefaultChannels();

    // 启动规则评估
    if (this.config.enabled) {
      this.startEvaluation();
    }
  }

  /**
   * 注册默认通道
   */
  private registerDefaultChannels(): void {
    this.channels.set('console', {
      type: AlertChannelType.CONSOLE,
      name: '控制台',
      config: {},
      enabled: true,
    });

    this.channels.set('email', {
      type: AlertChannelType.EMAIL,
      name: '邮件',
      config: {
        recipients: ['admin@example.com'],
      },
      enabled: true,
    });

    this.channels.set('slack', {
      type: AlertChannelType.SLACK,
      name: 'Slack',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
        channel: '#alerts',
      },
      enabled: !!process.env.SLACK_WEBHOOK_URL,
    });
  }

  /**
   * 启动规则评估
   */
  private startEvaluation(): void {
    for (const [id, rule] of this.rules) {
      if (rule.enabled) {
        this.scheduleRuleEvaluation(id);
      }
    }
  }

  /**
   * 调度规则评估
   */
  private scheduleRuleEvaluation(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) return;

    // 清除现有定时器
    if (this.evaluationTimers.has(ruleId)) {
      clearInterval(this.evaluationTimers.get(ruleId)!);
    }

    const timer = setInterval(() => {
      this.evaluateRule(ruleId);
    }, rule.interval * 1000);

    this.evaluationTimers.set(ruleId, timer);
  }

  /**
   * 评估规则
   */
  private evaluateRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return;

    try {
      // 获取指标值
      const metrics = this.getMetricsForRule(rule);

      // 评估条件
      const triggered = this.evaluateCondition(rule.condition, metrics);

      if (triggered) {
        // 检查是否已有活跃告警
        const existingAlert = this.alerts.find(
          (a) => a.ruleId === ruleId && a.status === AlertStatus.ACTIVE
        );

        if (!existingAlert) {
          // 创建新告警
          const alert = this.createAlert(rule, metrics);
          this.alerts.push(alert);
          this.emit('alert_triggered', alert);
          this.sendAlert(alert);
        }
      } else {
        // 检查是否可以解决告警
        const activeAlerts = this.alerts.filter(
          (a) => a.ruleId === ruleId && a.status === AlertStatus.ACTIVE
        );
        for (const alert of activeAlerts) {
          // 检查是否满足解决条件
          if (this.shouldResolveAlert(alert, metrics)) {
            alert.status = AlertStatus.RESOLVED;
            alert.resolvedAt = new Date();
            this.emit('alert_resolved', alert);
            this.sendAlertResolution(alert);
          }
        }
      }
    } catch (error) {
      console.error(`[AlertManager] 评估规则 ${ruleId} 失败:`, error);
    }
  }

  /**
   * 获取规则所需的指标
   */
  private getMetricsForRule(rule: AlertRule): Record<string, any> {
    // 从指标收集器获取数据
    // 这里简化处理，实际应从 MetricsCollector 获取
    return {
      cpu_usage: this.getMockMetric('cpu_usage'),
      memory_usage: this.getMockMetric('memory_usage'),
      health_status: 'healthy',
      error_rate: 1,
      response_time_p95: 500,
    };
  }

  /**
   * 获取模拟指标（实际应从指标收集器获取）
   */
  private getMockMetric(name: string): number {
    // 生成随机值用于演示
    const random = Math.random();
    switch (name) {
      case 'cpu_usage':
        return 30 + random * 50;
      case 'memory_usage':
        return 40 + random * 50;
      case 'error_rate':
        return random * 8;
      case 'response_time_p95':
        return 100 + random * 1900;
      default:
        return random * 100;
    }
  }

  /**
   * 评估条件表达式
   */
  private evaluateCondition(condition: string, metrics: Record<string, any>): boolean {
    try {
      // 简单条件评估
      // 支持: metric > value, metric >= value, metric < value, metric <= value, metric == value
      const patterns = [
        /(\w+)\s*>\s*([\d.]+)/,
        /(\w+)\s*>=\s*([\d.]+)/,
        /(\w+)\s*<\s*([\d.]+)/,
        /(\w+)\s*<=\s*([\d.]+)/,
        /(\w+)\s*==\s*([\d.]+)/,
        /(\w+)\s*!=\s*([\d.]+)/,
        /(\w+)\s*==\s*"([^"]+)"/,
        /(\w+)\s*!=\s*"([^"]+)"/,
      ];

      for (const pattern of patterns) {
        const match = condition.match(pattern);
        if (match) {
          const [, metricName, value] = match;
          const metricValue = metrics[metricName];
          if (metricValue === undefined) return false;

          const numValue = isNaN(Number(value)) ? value : Number(value);

          if (pattern === patterns[0]) return metricValue > numValue;
          if (pattern === patterns[1]) return metricValue >= numValue;
          if (pattern === patterns[2]) return metricValue < numValue;
          if (pattern === patterns[3]) return metricValue <= numValue;
          if (pattern === patterns[4]) return metricValue == numValue;
          if (pattern === patterns[5]) return metricValue != numValue;
          if (pattern === patterns[6]) return metricValue === numValue;
          if (pattern === patterns[7]) return metricValue !== numValue;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * 创建告警
   */
  private createAlert(rule: AlertRule, metrics: Record<string, any>): Alert {
    const now = new Date();
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ruleId: rule.id,
      name: rule.name,
      severity: rule.severity,
      status: AlertStatus.ACTIVE,
      message: `${rule.name}: ${rule.description}`,
      timestamp: now,
      labels: rule.labels,
      annotations: rule.annotations,
      value: metrics,
    };
  }

  /**
   * 判断是否应解决告警
   */
  private shouldResolveAlert(alert: Alert, metrics: Record<string, any>): boolean {
    // 检查条件是否已恢复正常
    const rule = this.rules.get(alert.ruleId);
    if (!rule) return true;

    const triggered = this.evaluateCondition(rule.condition, metrics);
    return !triggered;
  }

  /**
   * 发送告警
   */
  private sendAlert(alert: Alert): void {
    const rule = this.rules.get(alert.ruleId);
    if (!rule) return;

    // 获取告警通道
    const channels = rule.channels
      .map((type) => {
        for (const [, channel] of this.channels) {
          if (channel.type === type && channel.enabled) {
            return channel;
          }
        }
        return null;
      })
      .filter((c): c is AlertChannelConfig => c !== null);

    // 发送到各通道
    for (const channel of channels) {
      this.sendToChannel(channel, alert);
    }
  }

  /**
   * 发送告警解决通知
   */
  private sendAlertResolution(alert: Alert): void {
    this.emit('alert_resolution_sent', alert);
  }

  /**
   * 发送到指定通道
   */
  private sendToChannel(channel: AlertChannelConfig, alert: Alert): void {
    switch (channel.type) {
      case AlertChannelType.CONSOLE:
        console.log(`[ALERT] ${alert.severity.toUpperCase()}: ${alert.message}`);
        break;
      case AlertChannelType.EMAIL:
        this.sendEmailAlert(channel, alert);
        break;
      case AlertChannelType.SLACK:
        this.sendSlackAlert(channel, alert);
        break;
      case AlertChannelType.WEBHOOK:
        this.sendWebhookAlert(channel, alert);
        break;
      default:
        console.log(`[ALERT] 未实现的通道: ${channel.type}`);
    }
  }

  /**
   * 发送邮件告警
   */
  private sendEmailAlert(channel: AlertChannelConfig, alert: Alert): void {
    // 实际项目中使用邮件服务
    console.log(`[EMAIL] 发送告警到 ${channel.config.recipients}: ${alert.message}`);
  }

  /**
   * 发送Slack告警
   */
  private sendSlackAlert(channel: AlertChannelConfig, alert: Alert): void {
    // 实际项目中调用Slack API
    console.log(`[SLACK] 发送告警到 ${channel.config.channel}: ${alert.message}`);
  }

  /**
   * 发送Webhook告警
   */
  private sendWebhookAlert(channel: AlertChannelConfig, alert: Alert): void {
    // 实际项目中发送HTTP请求
    console.log(`[WEBHOOK] 发送告警到 ${channel.config.url}: ${alert.message}`);
  }

  /**
   * 创建告警规则
   */
  createRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    if (rule.enabled) {
      this.scheduleRuleEvaluation(rule.id);
    }
    this.emit('rule_created', rule);
  }

  /**
   * 更新告警规则
   */
  updateRule(id: string, updates: Partial<AlertRule>): AlertRule | null {
    const existing = this.rules.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.rules.set(id, updated);

    // 重新调度
    if (this.evaluationTimers.has(id)) {
      clearInterval(this.evaluationTimers.get(id)!);
      this.evaluationTimers.delete(id);
    }
    if (updated.enabled) {
      this.scheduleRuleEvaluation(id);
    }

    this.emit('rule_updated', updated);
    return updated;
  }

  /**
   * 删除告警规则
   */
  deleteRule(id: string): boolean {
    const result = this.rules.delete(id);
    if (result) {
      if (this.evaluationTimers.has(id)) {
        clearInterval(this.evaluationTimers.get(id)!);
        this.evaluationTimers.delete(id);
      }
      this.emit('rule_deleted', id);
    }
    return result;
  }

  /**
   * 获取所有规则
   */
  getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * 获取规则
   */
  getRule(id: string): AlertRule | null {
    return this.rules.get(id) || null;
  }

  /**
   * 创建告警通道
   */
  createChannel(channel: AlertChannelConfig): void {
    this.channels.set(channel.name, channel);
    this.emit('channel_created', channel);
  }

  /**
   * 更新告警通道
   */
  updateChannel(name: string, updates: Partial<AlertChannelConfig>): AlertChannelConfig | null {
    const existing = this.channels.get(name);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.channels.set(name, updated);
    this.emit('channel_updated', updated);
    return updated;
  }

  /**
   * 删除告警通道
   */
  deleteChannel(name: string): boolean {
    const result = this.channels.delete(name);
    if (result) {
      this.emit('channel_deleted', name);
    }
    return result;
  }

  /**
   * 获取所有通道
   */
  getChannels(): AlertChannelConfig[] {
    return Array.from(this.channels.values());
  }

  /**
   * 确认告警
   */
  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert || alert.status !== AlertStatus.ACTIVE) return false;

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = userId;

    this.emit('alert_acknowledged', alert);
    return true;
  }

  /**
   * 解决告警
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();

    this.emit('alert_resolved', alert);
    return true;
  }

  /**
   * 静音告警
   */
  muteAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.status = AlertStatus.MUTED;
    this.emit('alert_muted', alert);
    return true;
  }

  /**
   * 获取所有告警
   */
  getAlerts(status?: AlertStatus): Alert[] {
    if (status) {
      return this.alerts.filter((a) => a.status === status);
    }
    return [...this.alerts];
  }

  /**
   * 获取告警历史
   */
  getAlertHistory(startDate?: Date, endDate?: Date): Alert[] {
    let history = [...this.alertHistory];

    if (startDate) {
      history = history.filter((a) => a.timestamp >= startDate);
    }
    if (endDate) {
      history = history.filter((a) => a.timestamp <= endDate);
    }

    return history;
  }

  /**
   * 获取告警统计
   */
  getStats(): Record<string, any> {
    const stats = {
      total: this.alerts.length,
      by_status: {
        [AlertStatus.ACTIVE]: 0,
        [AlertStatus.RESOLVED]: 0,
        [AlertStatus.ACKNOWLEDGED]: 0,
        [AlertStatus.MUTED]: 0,
      },
      by_severity: {
        [AlertSeverity.INFO]: 0,
        [AlertSeverity.WARNING]: 0,
        [AlertSeverity.ERROR]: 0,
        [AlertSeverity.CRITICAL]: 0,
        [AlertSeverity.EMERGENCY]: 0,
      },
      rules_count: this.rules.size,
      channels_count: this.channels.size,
    };

    for (const alert of this.alerts) {
      stats.by_status[alert.status] = (stats.by_status[alert.status] || 0) + 1;
      stats.by_severity[alert.severity] = (stats.by_severity[alert.severity] || 0) + 1;
    }

    return stats;
  }

  /**
   * 归档旧告警
   */
  archiveOldAlerts(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    // 将旧告警移到历史
    const archived = this.alerts.filter((a) => a.timestamp < cutoffDate);
    this.alertHistory.push(...archived);
    this.alerts = this.alerts.filter((a) => a.timestamp >= cutoffDate);

    // 限制历史大小
    if (this.alertHistory.length > this.config.maxAlerts * 2) {
      this.alertHistory = this.alertHistory.slice(-this.config.maxAlerts);
    }

    this.emit('alerts_archived', { count: archived.length });
  }

  /**
   * 清除所有告警
   */
  clearAllAlerts(): void {
    this.alerts = [];
    this.alertHistory = [];
    this.emit('alerts_cleared');
  }

  /**
   * 关闭告警管理器
   */
  async close(): Promise<void> {
    for (const [, timer] of this.evaluationTimers) {
      clearInterval(timer);
    }
    this.evaluationTimers.clear();
    this.alerts = [];
    this.alertHistory = [];
  }
}

/**
 * 创建告警管理器（工厂函数）
 */
export function createAlertManager(config?: AlertConfig): AlertManager {
  return new AlertManager(config);
}

export default AlertManager;