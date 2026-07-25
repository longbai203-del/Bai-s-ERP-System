/**
 * 发送邮件任务
 * 处理各种邮件发送场景
 * @module send-email.job
 */

import { Job } from 'bullmq';

/**
 * 邮件模板类型
 */
export enum EmailTemplateType {
  /** 欢迎邮件 */
  WELCOME = 'welcome',
  /** 重置密码 */
  RESET_PASSWORD = 'reset_password',
  /** 订单确认 */
  ORDER_CONFIRMATION = 'order_confirmation',
  /** 发货通知 */
  SHIPPING_NOTIFICATION = 'shipping_notification',
  /** 发票邮件 */
  INVOICE = 'invoice',
  /** 报告邮件 */
  REPORT = 'report',
  /** 通知邮件 */
  NOTIFICATION = 'notification',
  /** 营销邮件 */
  MARKETING = 'marketing',
}

/**
 * 发送邮件任务数据
 */
export interface SendEmailJobData {
  /** 收件人 */
  to: string | string[];
  /** 抄送 */
  cc?: string | string[];
  /** 密送 */
  bcc?: string | string[];
  /** 邮件主题 */
  subject: string;
  /** 邮件模板类型 */
  templateType?: EmailTemplateType;
  /** 模板数据 */
  templateData?: Record<string, any>;
  /** HTML内容 */
  html?: string;
  /** 文本内容 */
  text?: string;
  /** 发件人 */
  from?: string;
  /** 回复地址 */
  replyTo?: string;
  /** 附件 */
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    cid?: string;
  }>;
  /** 优先级 */
  priority?: 'high' | 'normal' | 'low';
  /** 发送延迟（毫秒） */
  delay?: number;
  /** 邮件ID（更新时使用） */
  emailId?: string;
  /** 用户ID */
  userId?: string;
  /** 是否重要 */
  important?: boolean;
}

/**
 * 邮件发送结果
 */
export interface SendEmailJobResult {
  /** 是否成功 */
  success: boolean;
  /** 邮件ID */
  messageId: string;
  /** 收件人状态 */
  recipients: Array<{
    email: string;
    status: 'sent' | 'failed';
    error?: string;
  }>;
  /** 发送时间 */
  sentAt: Date;
  /** 响应时间（毫秒） */
  responseTime: number;
}

/**
 * 发送邮件任务类
 */
export class SendEmailJob {
  /**
   * 执行邮件发送任务
   */
  static async execute(job: Job<SendEmailJobData>): Promise<SendEmailJobResult> {
    const data = job.data;
    const startTime = Date.now();
    console.log(`[SendEmailJob] 开始发送邮件: ${data.subject}`);

    try {
      // 验证数据
      SendEmailJob.validateData(data);
      await job.updateProgress(10);

      // 渲染模板
      const content = await SendEmailJob.renderTemplate(data);
      await job.updateProgress(40);

      // 发送邮件
      const result = await SendEmailJob.sendEmail(content);
      await job.updateProgress(80);

      // 保存邮件记录
      await SendEmailJob.saveEmailRecord(data, result);
      await job.updateProgress(90);

      const duration = Date.now() - startTime;
      console.log(`[SendEmailJob] 邮件发送完成: ${data.subject} in ${duration}ms`);

      return {
        success: true,
        messageId: result.messageId,
        recipients: result.recipients,
        sentAt: new Date(),
        responseTime: duration,
      };
    } catch (error: any) {
      console.error(`[SendEmailJob] 邮件发送失败:`, error);
      throw new Error(`邮件发送失败: ${error.message}`);
    }
  }

  /**
   * 验证数据
   */
  private static validateData(data: SendEmailJobData): void {
    if (!data.to) {
      throw new Error('收件人不能为空');
    }
    if (!data.subject) {
      throw new Error('邮件主题不能为空');
    }
    if (!data.html && !data.text && !data.templateType) {
      throw new Error('邮件内容不能为空');
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
  private static async renderTemplate(data: SendEmailJobData): Promise<{
    html?: string;
    text?: string;
    subject: string;
  }> {
    let html = data.html;
    let text = data.text;
    let subject = data.subject;

    // 如果指定了模板类型，使用模板
    if (data.templateType) {
      const template = SendEmailJob.getTemplate(data.templateType);
      let renderedHtml = template.html;
      let renderedText = template.text || '';

      if (data.templateData) {
        for (const [key, value] of Object.entries(data.templateData)) {
          renderedHtml = renderedHtml.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
          renderedText = renderedText.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
          subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
      }

      html = html || renderedHtml;
      text = text || renderedText;
    }

    return { html, text, subject };
  }

  /**
   * 获取邮件模板
   */
  private static getTemplate(templateType: EmailTemplateType): { html: string; text?: string } {
    const templates: Record<EmailTemplateType, { html: string; text: string }> = {
      [EmailTemplateType.WELCOME]: {
        html: `
          <!DOCTYPE html>
          <html>
          <head><style>body{font-family:Arial,sans-serif;}</style></head>
          <body>
            <h1>欢迎 {{name}}</h1>
            <p>感谢您注册我们的系统！</p>
            <p>请点击以下链接验证您的邮箱：</p>
            <a href="{{verifyLink}}">验证邮箱</a>
          </body>
          </html>
        `,
        text: '欢迎 {{name}}\n感谢您注册我们的系统！\n请访问以下链接验证您的邮箱：{{verifyLink}}',
      },
      [EmailTemplateType.RESET_PASSWORD]: {
        html: `
          <h1>重置密码</h1>
          <p>您请求重置密码，请点击以下链接：</p>
          <a href="{{resetLink}}">重置密码</a>
          <p>此链接将在 {{expireHours}} 小时后过期。</p>
        `,
        text: '重置密码\n您请求重置密码，请访问以下链接：{{resetLink}}\n此链接将在 {{expireHours}} 小时后过期。',
      },
      [EmailTemplateType.ORDER_CONFIRMATION]: {
        html: `
          <h1>订单确认 #{{orderId}}</h1>
          <p>感谢您的购买！</p>
          <p>订单金额：{{amount}}</p>
          <p>预计发货日期：{{shippingDate}}</p>
          <p><a href="{{orderLink}}">查看订单详情</a></p>
        `,
        text: '订单确认 #{{orderId}}\n感谢您的购买！\n订单金额：{{amount}}\n预计发货日期：{{shippingDate}}\n查看订单详情：{{orderLink}}',
      },
      [EmailTemplateType.SHIPPING_NOTIFICATION]: {
        html: `
          <h1>订单已发货 #{{orderId}}</h1>
          <p>您的订单已发货！</p>
          <p>物流单号：{{trackingNumber}}</p>
          <p><a href="{{trackingLink}}">追踪物流</a></p>
        `,
        text: '订单已发货 #{{orderId}}\n您的订单已发货！\n物流单号：{{trackingNumber}}\n追踪物流：{{trackingLink}}',
      },
      [EmailTemplateType.INVOICE]: {
        html: `
          <h1>发票 #{{invoiceNumber}}</h1>
          <p>订单号：{{orderId}}</p>
          <p>金额：{{amount}}</p>
          <p>日期：{{date}}</p>
          <p><a href="{{invoiceLink}}">查看发票详情</a></p>
        `,
        text: '发票 #{{invoiceNumber}}\n订单号：{{orderId}}\n金额：{{amount}}\n日期：{{date}}\n查看发票详情：{{invoiceLink}}',
      },
      [EmailTemplateType.REPORT]: {
        html: `
          <h1>报告：{{reportName}}</h1>
          <p>报告已生成，请点击以下链接下载：</p>
          <a href="{{reportLink}}">下载报告</a>
        `,
        text: '报告：{{reportName}}\n报告已生成，请访问以下链接下载：{{reportLink}}',
      },
      [EmailTemplateType.NOTIFICATION]: {
        html: `
          <h1>{{title}}</h1>
          <p>{{message}}</p>
          <p><a href="{{link}}">查看详情</a></p>
        `,
        text: '{{title}}\n{{message}}\n查看详情：{{link}}',
      },
      [EmailTemplateType.MARKETING]: {
        html: `
          <h1>{{title}}</h1>
          <p>{{content}}</p>
          <p><a href="{{ctaLink}}">{{ctaText}}</a></p>
        `,
        text: '{{title}}\n{{content}}\n{{ctaText}}：{{ctaLink}}',
      },
    };

    return templates[templateType] || templates[EmailTemplateType.NOTIFICATION];
  }

  /**
   * 发送邮件
   */
  private static async sendEmail(content: {
    html?: string;
    text?: string;
    subject: string;
  }): Promise<{ messageId: string; recipients: Array<{ email: string; status: 'sent' | 'failed'; error?: string }> }> {
    // 实际项目中使用nodemailer
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log(`[SendEmailJob] 发送邮件: ${content.subject}`);

    return {
      messageId,
      recipients: [{ email: 'test@example.com', status: 'sent' }],
    };
  }

  /**
   * 保存邮件记录
   */
  private static async saveEmailRecord(
    data: SendEmailJobData,
    result: { messageId: string }
  ): Promise<void> {
    console.log(`[SendEmailJob] 保存邮件记录: ${result.messageId}`);
    // 实际项目中保存到数据库
  }
}

export default SendEmailJob;