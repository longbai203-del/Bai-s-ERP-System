/**
 * 报告消费者
 * 处理报告生成任务，支持多种格式导出
 * @module report.consumer
 */

import { Worker, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';

/**
 * 报告类型
 */
export enum ReportType {
  /** 销售报告 */
  SALES = 'sales',
  /** 财务报告 */
  FINANCE = 'finance',
  /** 库存报告 */
  INVENTORY = 'inventory',
  /** 客户报告 */
  CUSTOMER = 'customer',
  /** HR报告 */
  HR = 'hr',
  /** 采购报告 */
  PURCHASE = 'purchase',
  /** 生产报告 */
  PRODUCTION = 'production',
  /** 自定义报告 */
  CUSTOM = 'custom',
}

/**
 * 报告格式
 */
export enum ReportFormat {
  /** Excel */
  EXCEL = 'excel',
  /** PDF */
  PDF = 'pdf',
  /** CSV */
  CSV = 'csv',
  /** HTML */
  HTML = 'html',
  /** JSON */
  JSON = 'json',
}

/**
 * 报告任务数据
 */
export interface ReportJobData {
  /** 报告类型 */
  type: ReportType;
  /** 报告名称 */
  name: string;
  /** 报告格式 */
  format: ReportFormat;
  /** 时间范围 - 开始 */
  startDate?: Date;
  /** 时间范围 - 结束 */
  endDate?: Date;
  /** 过滤条件 */
  filters?: Record<string, any>;
  /** 分组字段 */
  groupBy?: string[];
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
  /** 用户ID */
  userId: string;
  /** 报告配置 */
  config?: Record<string, any>;
  /** 是否发送邮件 */
  sendEmail?: boolean;
  /** 邮件收件人 */
  emailRecipients?: string[];
  /** 报告ID（更新时使用） */
  reportId?: string;
}

/**
 * 报告结果
 */
export interface ReportResult {
  /** 是否成功 */
  success: boolean;
  /** 报告ID */
  reportId: string;
  /** 报告文件路径 */
  filePath?: string;
  /** 报告文件URL */
  fileUrl?: string;
  /** 文件大小 */
  fileSize?: number;
  /** 生成时间 */
  generatedAt: Date;
  /** 数据行数 */
  rowCount: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 报告消费者
 */
export class ReportConsumer {
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
    const queueConfig = this.configManager.getQueueConfig('report' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.worker = new Worker(
      'report',
      async (job: Job<ReportJobData>) => {
        return this.processReport(job);
      },
      {
        ...queueConfig.workerOptions,
        connection: redisClient.getClient()!,
      }
    );

    this.setupWorkerListeners();
    this.isRunning = true;
    console.log('[ReportConsumer] 初始化完成');
  }

  /**
   * 设置Worker事件监听
   */
  private setupWorkerListeners(): void {
    if (!this.worker) return;

    this.worker.on('completed', (job: Job) => {
      console.log(`[ReportConsumer] 报告生成完成: ${job.id}`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`[ReportConsumer] 报告生成失败: ${job?.id}`, error);
    });

    this.worker.on('progress', (job: Job, progress: number) => {
      console.log(`[ReportConsumer] 报告生成进度: ${job.id} - ${progress}%`);
    });
  }

  /**
   * 处理报告生成
   */
  private async processReport(job: Job<ReportJobData>): Promise<ReportResult> {
    const data = job.data;
    const startTime = Date.now();

    try {
      // 验证数据
      this.validateReportData(data);

      // 更新进度
      await job.updateProgress(10);

      // 收集数据
      const reportData = await this.collectReportData(data);
      await job.updateProgress(40);

      // 生成报告
      const filePath = await this.generateReport(data, reportData);
      await job.updateProgress(80);

      // 保存报告记录
      const reportId = await this.saveReport(data, reportData, filePath);
      await job.updateProgress(90);

      // 发送邮件（如果需要）
      if (data.sendEmail && data.emailRecipients) {
        await this.sendReportEmail(data, filePath, reportId);
      }

      const duration = Date.now() - startTime;
      console.log(`[ReportConsumer] 报告生成完成: ${data.name} in ${duration}ms`);

      return {
        success: true,
        reportId,
        filePath,
        fileUrl: `/reports/${reportId}`,
        fileSize: filePath ? 1024 : 0,
        generatedAt: new Date(),
        rowCount: reportData.length,
      };
    } catch (error: any) {
      console.error('[ReportConsumer] 报告生成失败:', error);
      throw new Error(`报告生成失败: ${error.message}`);
    }
  }

  /**
   * 验证报告数据
   */
  private validateReportData(data: ReportJobData): void {
    if (!data.type) {
      throw new Error('报告类型不能为空');
    }
    if (!data.name) {
      throw new Error('报告名称不能为空');
    }
    if (!data.format) {
      throw new Error('报告格式不能为空');
    }
    if (!data.userId) {
      throw new Error('用户ID不能为空');
    }
  }

  /**
   * 收集报告数据
   */
  private async collectReportData(data: ReportJobData): Promise<any[]> {
    // 实际项目中从数据库查询数据
    // 这里模拟数据
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.random() * 1000,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    }));

    // 应用过滤
    let filteredData = mockData;
    if (data.filters) {
      // 实际项目中应用过滤逻辑
    }

    // 应用分组
    if (data.groupBy && data.groupBy.length > 0) {
      // 实际项目中应用分组逻辑
    }

    // 应用排序
    if (data.sortBy) {
      filteredData.sort((a, b) => {
        const aVal = a[data.sortBy!];
        const bVal = b[data.sortBy!];
        if (data.sortOrder === 'desc') {
          return aVal < bVal ? 1 : -1;
        }
        return aVal < bVal ? -1 : 1;
      });
    }

    return filteredData;
  }

  /**
   * 生成报告
   */
  private async generateReport(data: ReportJobData, reportData: any[]): Promise<string> {
    // 实际项目中根据格式生成报告文件
    const fileName = `${data.name}_${Date.now()}`;
    const extensions: Record<ReportFormat, string> = {
      [ReportFormat.EXCEL]: 'xlsx',
      [ReportFormat.PDF]: 'pdf',
      [ReportFormat.CSV]: 'csv',
      [ReportFormat.HTML]: 'html',
      [ReportFormat.JSON]: 'json',
    };

    const extension = extensions[data.format] || 'json';
    const filePath = `/tmp/reports/${fileName}.${extension}`;

    // 模拟生成文件
    console.log(`[ReportConsumer] 生成报告文件: ${filePath}`);

    // 模拟耗时
    await new Promise(resolve => setTimeout(resolve, 1000));

    return filePath;
  }

  /**
   * 保存报告记录
   */
  private async saveReport(data: ReportJobData, reportData: any[], filePath: string): Promise<string> {
    // 实际项目中保存到数据库
    const reportId = `report_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log(`[ReportConsumer] 保存报告记录: ${reportId}`);
    return reportId;
  }

  /**
   * 发送报告邮件
   */
  private async sendReportEmail(data: ReportJobData, filePath: string, reportId: string): Promise<void> {
    // 实际项目中发送邮件
    console.log(`[ReportConsumer] 发送报告邮件: ${data.name} to ${data.emailRecipients}`);
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
    console.log('[ReportConsumer] 已停止');
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
 * 创建报告消费者（工厂函数）
 */
export function createReportConsumer(configManager?: BullConfigManager): ReportConsumer {
  return new ReportConsumer(configManager);
}

export default ReportConsumer;