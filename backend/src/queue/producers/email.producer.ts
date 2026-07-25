/**
 * 邮件生产者
 * 创建邮件发送任务并加入队列
 * @module email.producer
 */

import { Queue, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';
import { EmailJobData } from '../consumers/email.consumer';

/**
 * 邮件生产者类
 */
export class EmailProducer {
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
    const queueConfig = this.configManager.getQueueConfig('email' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.queue = new Queue('email', {
      ...queueConfig.queueOptions,
      connection: redisClient.getClient()!,
    });

    this.isInitialized = true;
    console.log('[EmailProducer] 初始化完成');
  }

  /**
   * 添加邮件任务
   */
  async addEmail(data: EmailJobData): Promise<Job<EmailJobData>> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }

    const job = await this.queue.add('send-email', data, {
      attempts: data.attempts || 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      delay: data.delay || 0,
      priority: data.priority === 'high' ? 1 : data.priority === 'low' ? 10 : 5,
      removeOnComplete: true,
      removeOnFail: false,
    });

    console.log(`[EmailProducer] 邮件任务已添加: ${job.id}`);
    return job;
  }

  /**
   * 批量添加邮件任务
   */
  async addBulkEmails(emailDataList: EmailJobData[]): Promise<Job<EmailJobData>[]> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }

    const jobs: Job<EmailJobData>[] = [];
    for (const data of emailDataList) {
      const job = await this.addEmail(data);
      jobs.push(job);
    }

    console.log(`[EmailProducer] 批量邮件任务已添加: ${jobs.length}`);
    return jobs;
  }

  /**
   * 添加欢迎邮件
   */
  async sendWelcomeEmail(to: string, name: string, verifyLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: '欢迎加入',
      template: 'welcome',
      templateData: { name, verifyLink },
      priority: 'high',
    });
  }

  /**
   * 添加密码重置邮件
   */
  async sendResetPasswordEmail(to: string, resetLink: string, expireHours: number = 24): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: '重置密码',
      template: 'reset_password',
      templateData: { resetLink, expireHours },
      priority: 'high',
    });
  }

  /**
   * 添加订单确认邮件
   */
  async sendOrderConfirmationEmail(to: string, orderId: string, amount: string, shippingDate: string, orderLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: `订单确认 #${orderId}`,
      template: 'order_confirmation',
      templateData: { orderId, amount, shippingDate, orderLink },
      priority: 'high',
    });
  }

  /**
   * 添加发货通知邮件
   */
  async sendShippingNotificationEmail(to: string, orderId: string, trackingNumber: string, trackingLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: `订单已发货 #${orderId}`,
      template: 'shipping_notification',
      templateData: { orderId, trackingNumber, trackingLink },
      priority: 'normal',
    });
  }

  /**
   * 添加发票邮件
   */
  async sendInvoiceEmail(to: string, invoiceNumber: string, orderId: string, amount: string, date: string, invoiceLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: `发票 #${invoiceNumber}`,
      template: 'invoice',
      templateData: { invoiceNumber, orderId, amount, date, invoiceLink },
      priority: 'normal',
    });
  }

  /**
   * 添加报告邮件
   */
  async sendReportEmail(to: string, reportName: string, reportLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: `报告已生成: ${reportName}`,
      template: 'report',
      templateData: { reportName, reportLink },
      priority: 'low',
    });
  }

  /**
   * 添加通知邮件
   */
  async sendNotificationEmail(to: string, title: string, message: string, link?: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: title,
      template: 'notification',
      templateData: { title, message, link },
      priority: 'normal',
    });
  }

  /**
   * 添加营销邮件
   */
  async sendMarketingEmail(to: string, title: string, content: string, ctaText: string, ctaLink: string): Promise<Job<EmailJobData>> {
    return this.addEmail({
      to,
      subject: title,
      template: 'marketing',
      templateData: { title, content, ctaText, ctaLink },
      priority: 'low',
    });
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
    console.log('[EmailProducer] 队列已清空');
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
    console.log('[EmailProducer] 已关闭');
  }
}

/**
 * 创建邮件生产者（工厂函数）
 */
export function createEmailProducer(configManager?: BullConfigManager): EmailProducer {
  return new EmailProducer(configManager);
}

export default EmailProducer;