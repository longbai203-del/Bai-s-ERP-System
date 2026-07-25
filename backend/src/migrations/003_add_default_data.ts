/**
 * 添加默认数据迁移
 * 初始化系统默认数据
 * @module 003_add_default_data
 */

import { Db } from 'mongodb';
import * as bcrypt from 'bcryptjs';

/**
 * 默认数据接口
 */
interface DefaultData {
  users?: any[];
  roles?: any[];
  categories?: any[];
  settings?: any[];
}

/**
 * 添加默认数据迁移类
 */
export class AddDefaultDataMigration {
  private static instance: AddDefaultDataMigration;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): AddDefaultDataMigration {
    if (!AddDefaultDataMigration.instance) {
      AddDefaultDataMigration.instance = new AddDefaultDataMigration();
    }
    return AddDefaultDataMigration.instance;
  }

  /**
   * 执行迁移
   */
  async up(db: Db): Promise<void> {
    console.log('[Migration 003] 开始添加默认数据...');

    // 创建默认角色
    await this.createDefaultRoles(db);

    // 创建默认管理员用户
    await this.createAdminUser(db);

    // 创建默认分类
    await this.createDefaultCategories(db);

    // 创建默认系统设置
    await this.createDefaultSettings(db);

    console.log('[Migration 003] 默认数据添加完成');
  }

  /**
   * 创建默认角色
   */
  private async createDefaultRoles(db: Db): Promise<void> {
    const roles = db.collection('roles');

    const defaultRoles = [
      {
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有所有权限',
        permissions: ['*'],
        isSystem: true,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '管理员',
        code: 'admin',
        description: '拥有大部分管理权限',
        permissions: [
          'user.read', 'user.create', 'user.update', 'user.delete',
          'role.read', 'customer.*', 'order.*', 'product.*',
          'inventory.*', 'finance.read', 'report.*',
        ],
        isSystem: true,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '经理',
        code: 'manager',
        description: '业务管理权限',
        permissions: [
          'customer.*', 'order.*', 'product.read', 'inventory.read',
          'report.read', 'purchase.read', 'purchase.create',
        ],
        isSystem: false,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '员工',
        code: 'employee',
        description: '基础操作权限',
        permissions: [
          'customer.read', 'customer.create', 'customer.update',
          'order.read', 'order.create', 'product.read',
        ],
        isSystem: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '财务',
        code: 'finance',
        description: '财务管理权限',
        permissions: [
          'finance.*', 'order.read', 'report.read',
          'report.export', 'purchase.read',
        ],
        isSystem: false,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'HR',
        code: 'hr',
        description: '人力资源管理权限',
        permissions: ['employee.*', 'user.read', 'attendance.*', 'payroll.*'],
        isSystem: false,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '库存管理员',
        code: 'inventory_manager',
        description: '库存管理权限',
        permissions: ['inventory.*', 'product.read', 'order.read'],
        isSystem: false,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '采购经理',
        code: 'purchase_manager',
        description: '采购管理权限',
        permissions: ['purchase.*', 'product.read', 'inventory.read'],
        isSystem: false,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const role of defaultRoles) {
      const existing = await roles.findOne({ code: role.code });
      if (!existing) {
        await roles.insertOne(role);
        console.log(`[Migration 003] 创建角色: ${role.name}`);
      } else {
        console.log(`[Migration 003] 角色已存在: ${role.name}`);
      }
    }
  }

  /**
   * 创建默认管理员用户
   */
  private async createAdminUser(db: Db): Promise<void> {
    const users = db.collection('users');
    const roles = db.collection('roles');

    // 获取超级管理员角色
    const adminRole = await roles.findOne({ code: 'super_admin' });

    const adminUser = {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('Admin@123456', 10),
      firstName: '系统',
      lastName: '管理员',
      roles: adminRole ? [adminRole._id.toString()] : [],
      isActive: true,
      isVerified: true,
      isSystem: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existing = await users.findOne({
      $or: [{ username: 'admin' }, { email: 'admin@example.com' }],
    });

    if (!existing) {
      await users.insertOne(adminUser);
      console.log('[Migration 003] 创建管理员用户: admin');
    } else {
      console.log('[Migration 003] 管理员用户已存在');
    }
  }

  /**
   * 创建默认分类
   */
  private async createDefaultCategories(db: Db): Promise<void> {
    const categories = db.collection('categories');

    const defaultCategories = [
      { name: '电子产品', code: 'electronics', description: '电子设备、电脑、手机等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '服装服饰', code: 'clothing', description: '服装、鞋子、配饰等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '食品饮料', code: 'food', description: '食品、饮料、保健品等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '家居用品', code: 'home', description: '家具、家纺、装饰等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '办公用品', code: 'office', description: '办公设备、文具、耗材等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '工业设备', code: 'industrial', description: '机械设备、工具、配件等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '汽车配件', code: 'auto', description: '汽车零部件、用品等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: '运动户外', code: 'sports', description: '运动器材、户外用品等', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    for (const category of defaultCategories) {
      const existing = await categories.findOne({ code: category.code });
      if (!existing) {
        await categories.insertOne(category);
        console.log(`[Migration 003] 创建分类: ${category.name}`);
      } else {
        console.log(`[Migration 003] 分类已存在: ${category.name}`);
      }
    }
  }

  /**
   * 创建默认系统设置
   */
  private async createDefaultSettings(db: Db): Promise<void> {
    const settings = db.collection('settings');

    const defaultSettings = [
      {
        key: 'company.name',
        value: 'Bai\'s ERP System',
        group: 'company',
        description: '公司名称',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.currency',
        value: 'CNY',
        group: 'company',
        description: '默认货币',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'company.timezone',
        value: 'Asia/Shanghai',
        group: 'company',
        description: '时区',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.maintenance',
        value: false,
        group: 'system',
        description: '系统维护模式',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'system.debug',
        value: false,
        group: 'system',
        description: '调试模式',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.smtp.host',
        value: 'smtp.example.com',
        group: 'email',
        description: 'SMTP服务器',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.smtp.port',
        value: 587,
        group: 'email',
        description: 'SMTP端口',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'email.from',
        value: 'noreply@example.com',
        group: 'email',
        description: '默认发件人',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'order.auto_confirm',
        value: true,
        group: 'order',
        description: '自动确认订单',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'order.status_default',
        value: 'pending',
        group: 'order',
        description: '默认订单状态',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'inventory.low_stock_alert',
        value: 10,
        group: 'inventory',
        description: '低库存预警阈值',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.session_timeout',
        value: 3600,
        group: 'auth',
        description: '会话超时时间（秒）',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.max_login_attempts',
        value: 5,
        group: 'auth',
        description: '最大登录尝试次数',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'auth.jwt_expires_in',
        value: '7d',
        group: 'auth',
        description: 'JWT过期时间',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'backup.enabled',
        value: true,
        group: 'backup',
        description: '启用自动备份',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'backup.schedule',
        value: '0 2 * * *',
        group: 'backup',
        description: '备份计划（cron）',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'notification.enabled',
        value: true,
        group: 'notification',
        description: '启用通知',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'notification.channels',
        value: ['app', 'email'],
        group: 'notification',
        description: '通知通道',
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const setting of defaultSettings) {
      const existing = await settings.findOne({ key: setting.key });
      if (!existing) {
        await settings.insertOne(setting);
        console.log(`[Migration 003] 创建设置: ${setting.key}`);
      } else {
        console.log(`[Migration 003] 设置已存在: ${setting.key}`);
      }
    }
  }

  /**
   * 回滚迁移
   */
  async down(db: Db): Promise<void> {
    console.log('[Migration 003] 开始回滚默认数据...');

    // 删除默认数据
    await db.collection('users').deleteOne({ username: 'admin' });
    await db.collection('roles').deleteMany({ isSystem: true });
    await db.collection('categories').deleteMany({});
    await db.collection('settings').deleteMany({});

    console.log('[Migration 003] 默认数据回滚完成');
  }

  /**
   * 获取版本号
   */
  getVersion(): string {
    return '003';
  }

  /**
   * 获取迁移名称
   */
  getName(): string {
    return 'add_default_data';
  }
}

/**
 * 执行向上迁移
 */
export async function up(db: Db): Promise<void> {
  const migration = AddDefaultDataMigration.getInstance();
  await migration.up(db);
}

/**
 * 执行向下迁移
 */
export async function down(db: Db): Promise<void> {
  const migration = AddDefaultDataMigration.getInstance();
  await migration.down(db);
}

export default AddDefaultDataMigration;