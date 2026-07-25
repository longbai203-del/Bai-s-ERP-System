/**
 * 邮件消费者
 * 处理邮件发送任务，支持模板渲染、附件、重试
 * @module email.consumer
 */

import { Worker, Job } from 'bullmq';
import { createQueueRedisClient } from '../config/redis.config';
import { BullConfigManager } from '../config/bull.config';

/**
 * 邮件任务数据
 */
export interface EmailJobData {
  /** 收件人 */
  to: string | string[];
  /** 抄送 */
  cc?: string | string[];
  /** 密送 */
  bcc?: string | string[];
  /** 邮件主题 */
  subject: string;
  /** 邮件内容（HTML） */
  html?: string;
  /** 邮件内容（纯文本） */
  text?: string;
  /** 模板名称 */
  template?: string;
  /** 模板数据 */
  templateData?: Record<string, any>;
  /** 附件 */
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    cid?: string;
  }>;
  /** 发件人 */
  from?: string;
  /** 回复地址 */
  replyTo?: string;
  /** 优先级 */
  priority?: 'high' | 'normal' | 'low';
  /** 发送延迟（毫秒） */
  delay?: number;
  /** 是否重要 */
  important?: boolean;
}

/**
 * 邮件发送结果
 */
export interface EmailResult {
  /** 是否成功 */
  success: boolean;
  /** 消息ID */
  messageId?: string;
  /** 错误信息 */
  error?: string;
  /** 发送时间 */
  sentAt: Date;
  /** 收件人状态 */
  recipients: Array<{
    email: string;
    status: 'sent' | 'failed';
    error?: string;
  }>;
}

/**
 * 邮件消费者
 */
export class EmailConsumer {
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
    const queueConfig = this.configManager.getQueueConfig('email' as any);
    const redisClient = createQueueRedisClient({
      mode: 'single' as any,
      single: this.configManager.getConfig().connection,
    });

    this.worker = new Worker(
      'email',
      async (job: Job<EmailJobData>) => {
        return this.processEmail(job);
      },
      {
        ...queueConfig.workerOptions,
        connection: redisClient.getClient()!,
      }
    );

    this.setupWorkerListeners();
    this.isRunning = true;
    console.log('[EmailConsumer] 初始化完成');
  }

  /**
   * 设置Worker事件监听
   */
  private setupWorkerListeners(): void {
    if (!this.worker) return;

    this.worker.on('completed', (job: Job) => {
      console.log(`[EmailConsumer] 邮件发送完成: ${job.id}`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`[EmailConsumer] 邮件发送失败: ${job?.id}`, error);
    });

    this.worker.on('error', (error: Error) => {
      console.error('[EmailConsumer] Worker错误:', error);
    });

    this.worker.on('stalled', (jobId: string) => {
      console.warn(`[EmailConsumer] 任务停滞: ${jobId}`);
    });

    this.worker.on('progress', (job: Job, progress: number) => {
      console.log(`[EmailConsumer] 邮件发送进度: ${job.id} - ${progress}%`);
    });
  }

  /**
   * 处理邮件发送
   */
  private async processEmail(job: Job<EmailJobData>): Promise<EmailResult> {
    const data = job.data;
    const startTime = Date.now();

    try {
      // 验证数据
      this.validateEmailData(data);

      // 渲染模板
      let htmlContent = data.html;
      let textContent = data.text;

      if (data.template) {
        const rendered = await this.renderTemplate(data.template, data.templateData || {});
        htmlContent = rendered.html;
        textContent = rendered.text || data.text;
      }

      // 发送邮件
      const result = await this.sendEmail({
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        subject: data.subject,
        html: htmlContent,
        text: textContent,
        from: data.from,
        replyTo: data.replyTo,
        attachments: data.attachments,
        priority: data.priority,
        important: data.important,
      });

      // 记录日志
      console.log(`[EmailConsumer] 邮件发送成功: ${data.subject} to ${data.to}`);

      return {
        success: true,
        messageId: result.messageId,
        sentAt: new Date(),
        recipients: Array.isArray(data.to) 
          ? data.to.map(email => ({ email, status: 'sent' as const }))
          : [{ email: data.to, status: 'sent' as const }],
      };
    } catch (error: any) {
      console.error('[EmailConsumer] 邮件发送失败:', error);

      // 如果失败，重新抛出以便Bull重试
      throw new Error(`邮件发送失败: ${error.message}`);
    }
  }

  /**
   * 验证邮件数据
   */
  private validateEmailData(data: EmailJobData): void {
    if (!data.to) {
      throw new Error('收件人不能为空');
    }
    if (!data.subject) {
      throw new Error('邮件主题不能为空');
    }
    if (!data.html && !data.text && !data.template) {
      throw new Error('邮件内容不能为空，请提供html、text或template');
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = Array.isArray(data.to) ? data.to : [data.to];
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        throw new Error(`邮箱格式无效: ${email}`);
      }
    }
  }

  /**
   * 渲染模板
   */
  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<{ html: string; text?: string }> {
    // 实际项目中，这里应该使用模板引擎（如 Handlebars、EJS 等）
    // 这里模拟模板渲染
    const template = this.getTemplate(templateName);
    let html = template;
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return { html, text: html.replace(/<[^>]+>/g, '') };
  }

  /**
   * 获取模板
   */
  private getTemplate(templateName: string): string {
    // 实际项目中，模板应该从文件系统或数据库读取
    const templates: Record<string, string> = {
      welcome: `
        <h1>欢迎 {{name}}</h1>
        <p>感谢您的注册！</p>
      `,
      reset_password: `
        <h1>重置密码</h1>
        <p>点击以下链接重置您的密码：</p>
        <a href="{{link}}">重置密码</a>
      `,
      order_confirmation: `
        <h1>订单确认</h1>
        <p>您的订单 {{orderId}} 已确认。</p>
      `,
      invoice: `
        <h1>发票</h1>
        <p>发票号：{{invoiceNumber}}</p>
        <p>金额：{{amount}}</p>
      `,
    };
    return templates[templateName] || `<p>${templateName}</p>`;
  }

  /**
   * 发送邮件
   */
  private async sendEmail(options: {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content?: string | Buffer;
      path?: string;
      cid?: string;
    }>;
    priority?: 'high' | 'normal' | 'low';
    important?: boolean;
  }): Promise<{ messageId: string }> {
    // 实际项目中，这里应该使用 nodemailer 或其他邮件发送库
    // 这里模拟邮件发送
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    
    console.log('[EmailConsumer] 发送邮件:', {
      to: options.to,
      subject: options.subject,
      from: options.from || 'noreply@example.com',
    });

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return { messageId };
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
    console.log('[EmailConsumer] 已停止');
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
 * 创建邮件消费者（工厂函数）
 */
export function createEmailConsumer(configManager?: BullConfigManager): EmailConsumer {
  return new EmailConsumer(configManager);
}

export default EmailConsumer;