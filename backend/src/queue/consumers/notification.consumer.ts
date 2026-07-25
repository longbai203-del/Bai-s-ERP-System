/**
 * 通知消费者
 * 处理系统通知、推送通知、多渠道发送
 * @module notification.consumer
 */

import { Worker, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';

/**
 * 通知类型
 */
export enum NotificationType {
  /** 系统通知 */
  SYSTEM = 'system',
  /** 订单通知 */
  ORDER = 'order',
  /** 用户通知 */
  USER = 'user',
  /** 审批通知 */
  APPROVAL = 'approval',
  /** 告警通知 */
  ALERT = 'alert',
  /** 营销通知 */
  MARKETING = 'marketing',
  /** 任务通知 */
  TASK = 'task',
}

/**
 * 通知通道
 */
export enum NotificationChannel {
  /** 应用内 */
  APP = 'app',
  /** 邮件 */
  EMAIL = 'email',
  /** 短信 */
  SMS = 'sms',
  /** 推送 */
  PUSH = 'push',
  /** Webhook */
  WEBHOOK = 'webhook',
}

/**
 * 通知优先级
 */
export enum NotificationPriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  NORMAL = 'normal',
  /** 高 */
  HIGH = 'high',
  /** 紧急 */
  URGENT = 'urgent',
}

/**
 * 通知任务数据
 */
export interface NotificationJobData {
  /** 通知类型 */
  type: NotificationType;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 接收者ID列表 */
  recipients: string[];
  /** 接收者角色 */
  roles?: string[];
  /** 通知通道 */
  channels: NotificationChannel[];
  /** 优先级 */
  priority: NotificationPriority;
  /** 链接 */
  link?: string;
  /** 附加数据 */
  metadata?: Record<string, any>;
  /** 是否静音 */
  silent?: boolean;
  /** 过期时间 */
  expiresAt?: Date;
}

/**
 * 通知结果
 */
export interface NotificationResult {
  /** 是否成功 */
  success: boolean;
  /** 发送时间 */
  sentAt: Date;
  /** 各通道结果 */
  channelResults: Record<NotificationChannel, {
    success: boolean;
    count: number;
    error?: string;
  }>;
  /** 接收者数量 */
  recipientCount: number;
}

/**
 * 通知消费者
 */
export class NotificationConsumer {
  private worker: Worker | null = null;
  private configManager: BullConfigManager;
  private isRunning = false;

  constructor(configManager?: BullConfigManager) {
    this.configManager = configManager || BullConfigManager.fromEnv();
  }

  /**
   * 初始化消费者
   */
  async initialize(): Promise<void> {
    const queueConfig = this.configManager.getQueueConfig('notification' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.worker = new Worker(
      'notification',
      async (job: Job<NotificationJobData>) => {
        return this.processNotification(job);
      },
      {
        ...queueConfig.workerOptions,
        connection: redisClient.getClient()!,
      }
    );

    this.setupWorkerListeners();
    this.isRunning = true;
    console.log('[NotificationConsumer] 初始化完成');
  }

  /**
   * 设置Worker事件监听
   */
  private setupWorkerListeners(): void {
    if (!this.worker) return;

    this.worker.on('completed', (job: Job) => {
      console.log(`[NotificationConsumer] 通知发送完成: ${job.id}`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`[NotificationConsumer] 通知发送失败: ${job?.id}`, error);
    });

    this.worker.on('error', (error: Error) => {
      console.error('[NotificationConsumer] Worker错误:', error);
    });
  }

  /**
   * 处理通知发送
   */
  private async processNotification(job: Job<NotificationJobData>): Promise<NotificationResult> {
    const data = job.data;
    const startTime = Date.now();

    try {
      // 验证数据
      this.validateNotificationData(data);

      // 获取接收者列表
      const recipients = await this.getRecipients(data);

      // 发送通知到各通道
      const channelResults: Record<NotificationChannel, {
        success: boolean;
        count: number;
        error?: string;
      }> = {} as any;

      const channelMap: Record<NotificationChannel, (recipients: string[], data: NotificationJobData) => Promise<number>> = {
        [NotificationChannel.APP]: this.sendAppNotification.bind(this),
        [NotificationChannel.EMAIL]: this.sendEmailNotification.bind(this),
        [NotificationChannel.SMS]: this.sendSmsNotification.bind(this),
        [NotificationChannel.PUSH]: this.sendPushNotification.bind(this),
        [NotificationChannel.WEBHOOK]: this.sendWebhookNotification.bind(this),
      };

      for (const channel of data.channels) {
        try {
          const sender = channelMap[channel];
          if (sender) {
            const count = await sender(recipients, data);
            channelResults[channel] = { success: true, count };
          } else {
            channelResults[channel] = { success: false, count: 0, error: '通道不支持' };
          }
        } catch (error: any) {
          channelResults[channel] = { success: false, count: 0, error: error.message };
        }
      }

      // 保存通知到数据库
      await this.saveNotification(data, recipients, channelResults);

      console.log(`[NotificationConsumer] 通知发送完成: ${data.title} to ${recipients.length} recipients`);

      return {
        success: true,
        sentAt: new Date(),
        channelResults,
        recipientCount: recipients.length,
      };
    } catch (error: any) {
      console.error('[NotificationConsumer] 通知发送失败:', error);
      throw new Error(`通知发送失败: ${error.message}`);
    }
  }

  /**
   * 验证通知数据
   */
  private validateNotificationData(data: NotificationJobData): void {
    if (!data.title) {
      throw new Error('通知标题不能为空');
    }
    if (!data.content) {
      throw new Error('通知内容不能为空');
    }
    if (!data.recipients || data.recipients.length === 0) {
      throw new Error('接收者不能为空');
    }
    if (!data.channels || data.channels.length === 0) {
      throw new Error('通知通道不能为空');
    }
  }

  /**
   * 获取接收者列表
   */
  private async getRecipients(data: NotificationJobData): Promise<string[]> {
    let recipients = [...data.recipients];

    // 如果指定了角色，添加角色对应的用户
    if (data.roles && data.roles.length > 0) {
      // 实际项目中从数据库获取角色对应的用户
      const roleUsers = await this.getUsersByRoles(data.roles);
      recipients = [...recipients, ...roleUsers];
    }

    // 去重
    return [...new Set(recipients)];
  }

  /**
   * 根据角色获取用户
   */
  private async getUsersByRoles(roles: string[]): Promise<string[]> {
    // 实际项目中从数据库查询
    return roles.map(role => `user_${role}`);
  }

  /**
   * 应用内通知
   */
  private async sendAppNotification(recipients: string[], data: NotificationJobData): Promise<number> {
    // 实际项目中保存到数据库通知表
    console.log(`[NotificationConsumer] 应用内通知: ${data.title} to ${recipients.length} users`);
    
    // 模拟发送
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return recipients.length;
  }

  /**
   * 邮件通知
   */
  private async sendEmailNotification(recipients: string[], data: NotificationJobData): Promise<number> {
    console.log(`[NotificationConsumer] 邮件通知: ${data.title} to ${recipients.length} recipients`);
    
    // 实际项目中调用邮件服务
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return recipients.length;
  }

  /**
   * 短信通知
   */
  private async sendSmsNotification(recipients: string[], data: NotificationJobData): Promise<number> {
    console.log(`[NotificationConsumer] 短信通知: ${data.title} to ${recipients.length} recipients`);
    
    // 实际项目中调用短信服务
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return recipients.length;
  }

  /**
   * 推送通知
   */
  private async sendPushNotification(recipients: string[], data: NotificationJobData): Promise<number> {
    console.log(`[NotificationConsumer] 推送通知: ${data.title} to ${recipients.length} devices`);
    
    // 实际项目中调用推送服务（如 FCM、APNS）
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return recipients.length;
  }

  /**
   * Webhook通知
   */
  private async sendWebhookNotification(recipients: string[], data: NotificationJobData): Promise<number> {
    console.log(`[NotificationConsumer] Webhook通知: ${data.title} to ${recipients.length} endpoints`);
    
    // 实际项目中发送HTTP请求
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return recipients.length;
  }

  /**
   * 保存通知到数据库
   */
  private async saveNotification(
    data: NotificationJobData,
    recipients: string[],
    results: Record<NotificationChannel, { success: boolean; count: number; error?: string }>
  ): Promise<void> {
    // 实际项目中保存到数据库
    console.log('[NotificationConsumer] 保存通知记录');
  }

  /**
   * 停止消费者
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
    }
    console.log('[NotificationConsumer] 已停止');
  }

  /**
   * 获取状态
   */
  getStatus(): { isRunning: boolean; worker: string | null } {
    return {
      isRunning: this.isRunning,
      worker: this.worker ? 'active' : 'inactive',
    };
  }
}

/**
 * 创建通知消费者（工厂函数）
 */
export function createNotificationConsumer(configManager?: BullConfigManager): NotificationConsumer {
  return new NotificationConsumer(configManager);
}

export default NotificationConsumer;