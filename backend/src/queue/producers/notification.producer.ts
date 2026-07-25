/**
 * 通知生产者
 * 创建通知任务并加入队列
 * @module notification.producer
 */

import { Queue, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';
import { NotificationJobData, NotificationType, NotificationChannel, NotificationPriority } from '../consumers/notification.consumer';

/**
 * 通知生产者类
 */
export class NotificationProducer {
  private queue: Queue | null = null;
  private configManager: BullConfigManager;
  private isInitialized = false;

  constructor(configManager?: BullConfigManager) {
    this.configManager = configManager || BullConfigManager.fromEnv();
  }

  /**
   * 初始化生产者
   */
  async initialize(): Promise<void> {
    const queueConfig = this.configManager.getQueueConfig('notification' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.queue = new Queue('notification', {
      ...queueConfig.queueOptions,
      connection: redisClient.getClient()!,
    });

    this.isInitialized = true;
    console.log('[NotificationProducer] 初始化完成');
  }

  /**
   * 添加通知任务
   */
  async addNotification(data: NotificationJobData): Promise<Job<NotificationJobData>> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }

    const priorityMap = {
      [NotificationPriority.URGENT]: 1,
      [NotificationPriority.HIGH]: 2,
      [NotificationPriority.NORMAL]: 5,
      [NotificationPriority.LOW]: 10,
    };

    const job = await this.queue.add('send-notification', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      priority: priorityMap[data.priority] || 5,
      removeOnComplete: true,
      removeOnFail: false,
    });

    console.log(`[NotificationProducer] 通知任务已添加: ${job.id}`);
    return job;
  }

  /**
   * 发送系统通知
   */
  async sendSystemNotification(
    recipients: string[],
    title: string,
    content: string,
    priority: NotificationPriority = NotificationPriority.NORMAL,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.SYSTEM,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL],
      priority,
      metadata,
    });
  }

  /**
   * 发送订单通知
   */
  async sendOrderNotification(
    recipients: string[],
    title: string,
    content: string,
    orderId?: string,
    priority: NotificationPriority = NotificationPriority.HIGH,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.ORDER,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority,
      metadata: { ...metadata, orderId },
      link: `/orders/${orderId}`,
    });
  }

  /**
   * 发送用户通知
   */
  async sendUserNotification(
    recipients: string[],
    title: string,
    content: string,
    priority: NotificationPriority = NotificationPriority.NORMAL,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.USER,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL],
      priority,
      metadata,
    });
  }

  /**
   * 发送审批通知
   */
  async sendApprovalNotification(
    recipients: string[],
    title: string,
    content: string,
    approvalId?: string,
    priority: NotificationPriority = NotificationPriority.HIGH,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.APPROVAL,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority,
      metadata: { ...metadata, approvalId },
      link: `/approvals/${approvalId}`,
    });
  }

  /**
   * 发送告警通知
   */
  async sendAlertNotification(
    recipients: string[],
    title: string,
    content: string,
    priority: NotificationPriority = NotificationPriority.URGENT,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.ALERT,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH],
      priority,
      metadata,
    });
  }

  /**
   * 发送营销通知
   */
  async sendMarketingNotification(
    recipients: string[],
    title: string,
    content: string,
    priority: NotificationPriority = NotificationPriority.LOW,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.MARKETING,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL],
      priority,
      metadata,
    });
  }

  /**
   * 发送任务通知
   */
  async sendTaskNotification(
    recipients: string[],
    title: string,
    content: string,
    taskId?: string,
    priority: NotificationPriority = NotificationPriority.NORMAL,
    metadata?: Record<string, any>
  ): Promise<Job<NotificationJobData>> {
    return this.addNotification({
      type: NotificationType.TASK,
      title,
      content,
      recipients,
      channels: [NotificationChannel.APP, NotificationChannel.EMAIL, NotificationChannel.PUSH],
      priority,
      metadata: { ...metadata, taskId },
      link: `/tasks/${taskId}`,
    });
  }

  /**
   * 批量发送通知
   */
  async sendBulkNotifications(notificationList: Omit<NotificationJobData, 'channels'>[]): Promise<Job<NotificationJobData>[]> {
    const jobs: Job<NotificationJobData>[] = [];
    for (const notification of notificationList) {
      const job = await this.addNotification({
        ...notification,
        channels: [NotificationChannel.APP, NotificationChannel.EMAIL],
      });
      jobs.push(job);
    }
    console.log(`[NotificationProducer] 批量通知任务已添加: ${jobs.length}`);
    return jobs;
  }

  /**
   * 获取队列状态
   */
  async getQueueStatus(): Promise<{
    count: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    if (!this.isInitialized || !this.queue) {
      return { count: 0, active: 0, completed: 0, failed: 0 };
    }

    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
    ]);

    return {
      count: waiting + active,
      active,
      completed,
      failed,
    };
  }

  /**
   * 清空队列
   */
  async clearQueue(): Promise<void> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }
    await this.queue.obliterate({ force: true });
    console.log('[NotificationProducer] 队列已清空');
  }

  /**
   * 关闭生产者
   */
  async close(): Promise<void> {
    if (this.queue) {
      await this.queue.close();
      this.queue = null;
    }
    this.isInitialized = false;
    console.log('[NotificationProducer] 已关闭');
  }
}

/**
 * 创建通知生产者（工厂函数）
 */
export function createNotificationProducer(configManager?: BullConfigManager): NotificationProducer {
  return new NotificationProducer(configManager);
}

export default NotificationProducer;