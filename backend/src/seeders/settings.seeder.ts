/**
 * 设置种子数据
 * 生成测试系统设置数据
 * @module seeders/settings.seeder
 */

import { Db } from 'mongodb';

/**
 * 设置种子数据生成器
 */
export class SettingsSeeder {
  private static instance: SettingsSeeder;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): SettingsSeeder {
    if (!SettingsSeeder.instance) {
      SettingsSeeder.instance = new SettingsSeeder();
    }
    return SettingsSeeder.instance;
  }

  /**
   * 生成设置数据
   */
  private generateSettings(): any[] {
    return [
      // 公司设置
      {
        key: 'company.name',
        value: 'Bai\'s ERP System',
        group: 'company',
        description: '公司名称',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.legal_name',
        value: 'Bai\'s ERP System Ltd.',
        group: 'company',
        description: '公司法定名称',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.registration_number',
        value: 'REG-2024-001',
        group: 'company',
        description: '公司注册号',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.tax_id',
        value: 'TAX-2024-001',
        group: 'company',
        description: '税务登记号',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.address',
        value: '123 Main Street, Business District',
        group: 'company',
        description: '公司地址',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.phone',
        value: '+86-400-123-4567',
        group: 'company',
        description: '公司电话',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.email',
        value: 'info@baierp.com',
        group: 'company',
        description: '公司邮箱',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.website',
        value: 'https://www.baierp.com',
        group: 'company',
        description: '公司网站',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.currency',
        value: 'CNY',
        group: 'company',
        description: '默认货币',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.timezone',
        value: 'Asia/Shanghai',
        group: 'company',
        description: '时区',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.logo_url',
        value: '/images/logo.png',
        group: 'company',
        description: '公司Logo',
        isEditable: true,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 系统设置
      {
        key: 'system.maintenance_mode',
        value: false,
        group: 'system',
        description: '系统维护模式',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.debug_mode',
        value: false,
        group: 'system',
        description: '调试模式',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.max_upload_size',
        value: 10485760,
        group: 'system',
        description: '最大上传文件大小（字节）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.allowed_file_types',
        value: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'],
        group: 'system',
        description: '允许的文件类型',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.log_retention_days',
        value: 30,
        group: 'system',
        description: '日志保留天数',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 邮件设置
      {
        key: 'email.smtp.host',
        value: 'smtp.example.com',
        group: 'email',
        description: 'SMTP服务器',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.smtp.port',
        value: 587,
        group: 'email',
        description: 'SMTP端口',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.smtp.secure',
        value: true,
        group: 'email',
        description: '启用安全连接',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.from',
        value: 'noreply@baierp.com',
        group: 'email',
        description: '默认发件人',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.from_name',
        value: 'Bai\'s ERP System',
        group: 'email',
        description: '发件人名称',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 订单设置
      {
        key: 'order.auto_confirm',
        value: true,
        group: 'order',
        description: '自动确认订单',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'order.default_status',
        value: 'pending',
        group: 'order',
        description: '默认订单状态',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'order.cancel_timeout',
        value: 3600,
        group: 'order',
        description: '订单自动取消超时（秒）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 库存设置
      {
        key: 'inventory.low_stock_threshold',
        value: 10,
        group: 'inventory',
        description: '低库存阈值',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'inventory.critical_stock_threshold',
        value: 5,
        group: 'inventory',
        description: '库存报警阈值',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'inventory.auto_reorder',
        value: false,
        group: 'inventory',
        description: '启用自动订货',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 认证设置
      {
        key: 'auth.session_timeout',
        value: 3600,
        group: 'auth',
        description: '会话超时时间（秒）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.max_login_attempts',
        value: 5,
        group: 'auth',
        description: '最大登录尝试次数',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.jwt_expires_in',
        value: '7d',
        group: 'auth',
        description: 'JWT过期时间',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.refresh_token_expires_in',
        value: '30d',
        group: 'auth',
        description: '刷新令牌过期时间',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 备份设置
      {
        key: 'backup.enabled',
        value: true,
        group: 'backup',
        description: '启用自动备份',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'backup.schedule',
        value: '0 2 * * *',
        group: 'backup',
        description: '备份计划（cron表达式）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'backup.retention_days',
        value: 30,
        group: 'backup',
        description: '备份保留天数',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 通知设置
      {
        key: 'notification.enabled',
        value: true,
        group: 'notification',
        description: '启用通知',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'notification.channels',
        value: ['app', 'email'],
        group: 'notification',
        description: '通知通道',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'notification.batch_interval',
        value: 60,
        group: 'notification',
        description: '通知批量间隔（秒）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 安全设置
      {
        key: 'security.cors_enabled',
        value: true,
        group: 'security',
        description: '启用CORS',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'security.csrf_enabled',
        value: true,
        group: 'security',
        description: '启用CSRF防护',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'security.rate_limit_enabled',
        value: true,
        group: 'security',
        description: '启用速率限制',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'security.rate_limit_requests',
        value: 100,
        group: 'security',
        description: '速率限制请求数',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'security.rate_limit_window',
        value: 60,
        group: 'security',
        description: '速率限制窗口（秒）',
        isEditable: true,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * 执行种子数据生成
   */
  async seed(db: Db): Promise<number> {
    console.log('[SettingsSeeder] 开始生成系统设置数据...');

    const collection = db.collection('settings');
    const settings = this.generateSettings();

    let insertedCount = 0;

    for (const setting of settings) {
      try {
        const existing = await collection.findOne({ key: setting.key });
        if (existing) {
          await collection.updateOne(
            { key: setting.key },
            { $set: { ...setting, updatedAt: new Date() } }
          );
          insertedCount++;
        } else {
          await collection.insertOne(setting);
          insertedCount++;
        }
      } catch (error) {
        console.error(`[SettingsSeeder] 插入失败: ${setting.key}`, error);
      }
    }

    console.log(`[SettingsSeeder] 完成，共处理 ${insertedCount} 条记录`);
    return insertedCount;
  }

  /**
   * 清空设置数据
   */
  async clear(db: Db): Promise<number> {
    const collection = db.collection('settings');
    const result = await collection.deleteMany({});
    console.log(`[SettingsSeeder] 已清空 ${result.deletedCount} 条记录`);
    return result.deletedCount || 0;
  }
}

/**
 * 执行种子数据生成（便捷函数）
 */
export async function seed(db: Db): Promise<number> {
  const seeder = SettingsSeeder.getInstance();
  return seeder.seed(db);
}

/**
 * 清空设置数据（便捷函数）
 */
export async function clear(db: Db): Promise<number> {
  const seeder = SettingsSeeder.getInstance();
  return seeder.clear(db);
}

export default SettingsSeeder;