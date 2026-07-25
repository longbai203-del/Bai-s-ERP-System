/**
 * 报告生产者
 * 创建报告生成任务并加入队列
 * @module report.producer
 */

import { Queue, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';
import { ReportJobData, ReportType, ReportFormat } from '../consumers/report.consumer';

/**
 * 报告生产者类
 */
export class ReportProducer {
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
    const queueConfig = this.configManager.getQueueConfig('report' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.queue = new Queue('report', {
      ...queueConfig.queueOptions,
      connection: redisClient.getClient()!,
    });

    this.isInitialized = true;
    console.log('[ReportProducer] 初始化完成');
  }

  /**
   * 添加报告任务
   */
  async addReport(data: ReportJobData): Promise<Job<ReportJobData>> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }

    const job = await this.queue.add('generate-report', data, {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      timeout: 300000, // 5分钟超时
      removeOnComplete: true,
      removeOnFail: false,
    });

    console.log(`[ReportProducer] 报告任务已添加: ${job.id}`);
    return job;
  }

  /**
   * 生成销售报告
   */
  async generateSalesReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    startDate?: Date,
    endDate?: Date,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.SALES,
      name,
      format,
      startDate,
      endDate,
      filters,
      userId,
    });
  }

  /**
   * 生成财务报告
   */
  async generateFinanceReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    startDate?: Date,
    endDate?: Date,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.FINANCE,
      name,
      format,
      startDate,
      endDate,
      filters,
      userId,
    });
  }

  /**
   * 生成库存报告
   */
  async generateInventoryReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.INVENTORY,
      name,
      format,
      filters,
      userId,
    });
  }

  /**
   * 生成客户报告
   */
  async generateCustomerReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.CUSTOMER,
      name,
      format,
      filters,
      userId,
    });
  }

  /**
   * 生成HR报告
   */
  async generateHRReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.HR,
      name,
      format,
      filters,
      userId,
    });
  }

  /**
   * 生成采购报告
   */
  async generatePurchaseReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    startDate?: Date,
    endDate?: Date,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.PURCHASE,
      name,
      format,
      startDate,
      endDate,
      filters,
      userId,
    });
  }

  /**
   * 生成生产报告
   */
  async generateProductionReport(
    userId: string,
    name: string,
    format: ReportFormat = ReportFormat.EXCEL,
    filters?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.PRODUCTION,
      name,
      format,
      filters,
      userId,
    });
  }

  /**
   * 生成自定义报告
   */
  async generateCustomReport(
    userId: string,
    name: string,
    config: Record<string, any>,
    format: ReportFormat = ReportFormat.EXCEL
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.CUSTOM,
      name,
      format,
      config,
      userId,
    });
  }

  /**
   * 生成并发送报告邮件
   */
  async generateAndSendReport(
    userId: string,
    name: string,
    format: ReportFormat,
    emailRecipients: string[],
    config?: Record<string, any>
  ): Promise<Job<ReportJobData>> {
    return this.addReport({
      type: ReportType.CUSTOM,
      name,
      format,
      config,
      userId,
      sendEmail: true,
      emailRecipients,
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
   * 获取任务状态
   */
  async getJobStatus(jobId: string): Promise<{
    status: string;
    data?: any;
    error?: string;
  } | null> {
    if (!this.isInitialized || !this.queue) {
      return null;
    }

    try {
      const job = await this.queue.getJob(jobId);
      if (!job) return null;

      const state = await job.getState();
      return {
        status: state,
        data: job.data,
        error: job.failedReason || undefined,
      };
    } catch (error) {
      console.error(`[ReportProducer] 获取任务状态失败:`, error);
      return null;
    }
  }

  /**
   * 取消任务
   */
  async cancelJob(jobId: string): Promise<boolean> {
    if (!this.isInitialized || !this.queue) {
      return false;
    }

    try {
      const job = await this.queue.getJob(jobId);
      if (!job) return false;

      await job.remove();
      console.log(`[ReportProducer] 任务已取消: ${jobId}`);
      return true;
    } catch (error) {
      console.error(`[ReportProducer] 取消任务失败:`, error);
      return false;
    }
  }

  /**
   * 清空队列
   */
  async clearQueue(): Promise<void> {
    if (!this.isInitialized || !this.queue) {
      throw new Error('生产者未初始化');
    }
    await this.queue.obliterate({ force: true });
    console.log('[ReportProducer] 队列已清空');
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
    console.log('[ReportProducer] 已关闭');
  }
}

/**
 * 创建报告生产者（工厂函数）
 */
export function createReportProducer(configManager?: BullConfigManager): ReportProducer {
  return new ReportProducer(configManager);
}

export default ReportProducer;