/**
 * Prisma种子数据
 * 初始化数据库种子数据
 * @module prisma/seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * 种子数据配置
 */
interface SeedConfig {
  users?: number;
  customers?: number;
  products?: number;
  orders?: number;
}

/**
 * 默认种子配置
 */
const DEFAULT_CONFIG: SeedConfig = {
  users: 10,
  customers: 50,
  products: 100,
  orders: 200,
};

/**
 * 生成随机数据工具
 */
class RandomData {
  static pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static number(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static float(min: number, max: number, decimals: number = 2): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  static date(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  static string(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static email(): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'company.com'];
    return `${this.string(8).toLowerCase()}@${RandomData.pick(domains)}`;
  }

  static phone(): string {
    return `+86-${RandomData.number(130, 199)}${RandomData.number(1000, 9999)}${RandomData.number(1000, 9999)}`;
  }
}

/**
 * 种子数据类
 */
export class DatabaseSeeder {
  private config: SeedConfig;

  constructor(config: SeedConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 执行种子数据
   */
  async seed(): Promise<void> {
    console.log('🚀 开始执行种子数据...');

    try {
      // 1. 创建用户
      console.log('📝 创建用户...');
      const users = await this.seedUsers();

      // 2. 创建客户
      console.log('📝 创建客户...');
      const customers = await this.seedCustomers();

      // 3. 创建产品
      console.log('📝 创建产品...');
      const products = await this.seedProducts();

      // 4. 创建订单
      console.log('📝 创建订单...');
      await this.seedOrders(users, customers, products);

      console.log('✅ 种子数据执行完成！');
    } catch (error) {
      console.error('❌ 种子数据执行失败:', error);
      throw error;
    }
  }

  /**
   * 种子用户
   */
  private async seedUsers(): Promise<any[]> {
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      console.log(`   ⚠️ 已存在 ${existingCount} 个用户，跳过种子`);
      return prisma.user.findMany();
    }

    const roles = ['admin', 'manager', 'employee', 'finance', 'hr'];
    const users = [];

    // 管理员
    const adminPassword = await bcrypt.hash('Admin@123456', 10);
    users.push({
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      firstName: '系统',
      lastName: '管理员',
      roles: ['admin', 'super_admin'],
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 普通用户
    for (let i = 1; i < (this.config.users || 10); i++) {
      const firstName = ['张', '李', '王', '刘', '陈', '赵', '周', '吴', '郑', '孙'][i % 10] + RandomData.string(2);
      const lastName = ['伟', '芳', '娜', '强', '丽', '敏', '杰', '秀英', '涛', '慧'][i % 10];
      const password = await bcrypt.hash('Test@123456', 10);

      users.push({
        username: `user${i}`,
        email: RandomData.email(),
        passwordHash: password,
        firstName,
        lastName,
        roles: [RandomData.pick(roles)],
        isActive: true,
        isVerified: true,
        createdAt: RandomData.date(new Date(2024, 0, 1), new Date()),
        updatedAt: new Date(),
      });
    }

    const result = await prisma.user.createMany({
      data: users,
    });

    console.log(`   ✅ 创建了 ${result.count} 个用户`);
    return await prisma.user.findMany();
  }

  /**
   * 种子客户
   */
  private async seedCustomers(): Promise<any[]> {
    const existingCount = await prisma.customer.count();
    if (existingCount > 0) {
      console.log(`   ⚠️ 已存在 ${existingCount} 个客户，跳过种子`);
      return prisma.customer.findMany();
    }

    const statuses = ['active', 'active', 'active', 'inactive', 'vip', 'lead'];
    const industries = ['Technology', 'Retail', 'Manufacturing', 'Finance', 'Healthcare', 'Education'];
    const customers = [];

    for (let i = 0; i < (this.config.customers || 50); i++) {
      const firstName = ['张', '李', '王', '刘', '陈', '赵', '周', '吴', '郑', '孙'][i % 10];
      const lastName = ['伟', '芳', '娜', '强', '丽', '敏', '杰', '秀英', '涛', '慧'][i % 10];

      customers.push({
        name: `${firstName}${lastName}`,
        email: RandomData.email(),
        phone: RandomData.phone(),
        address: `${RandomData.number(1, 999)} 号路 ${RandomData.number(1, 50)} 号`,
        city: RandomData.pick(['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉']),
        country: '中国',
        postalCode: RandomData.string(6).toUpperCase(),
        taxId: RandomData.string(10).toUpperCase(),
        industry: RandomData.pick(industries),
        status: RandomData.pick(statuses),
        tags: ['VIP', 'Enterprise', 'Startup', 'Long-term'].slice(0, RandomData.number(0, 3)),
        totalOrders: RandomData.number(0, 30),
        totalSpent: RandomData.float(0, 100000),
        lastOrderAt: RandomData.date(new Date(2024, 0, 1), new Date()),
        notes: '',
        createdAt: RandomData.date(new Date(2024, 0, 1), new Date()),
        updatedAt: new Date(),
      });
    }

    const result = await prisma.customer.createMany({
      data: customers,
    });

    console.log(`   ✅ 创建了 ${result.count} 个客户`);
    return await prisma.customer.findMany();
  }

  /**
   * 种子产品
   */
  private async seedProducts(): Promise<any[]> {
    const existingCount = await prisma.product.count();
    if (existingCount > 0) {
      console.log(`   ⚠️ 已存在 ${existingCount} 个产品，跳过种子`);
      return prisma.product.findMany();
    }

    const categories = ['电子产品', '服装服饰', '食品饮料', '家居用品', '办公用品', '工业设备'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Sony', 'Dell', 'HP', 'Lenovo', 'Xiaomi'];
    const products = [];

    for (let i = 0; i < (this.config.products || 100); i++) {
      const price = RandomData.float(10, 5000);
      const cost = price * RandomData.float(0.3, 0.8);

      products.push({
        name: `${RandomData.pick(['智能', '经典', '高端', '专业', '时尚'])} ${RandomData.pick(['手机', '电脑', '耳机', '手表', '音箱', '相机'])} ${RandomData.number(100, 999)}`,
        sku: `SKU-${String(i + 1).padStart(8, '0')}`,
        description: `这是一款${RandomData.pick(['高性能', '便携', '时尚', '专业'])}的${RandomData.pick(['电子产品', '生活用品', '办公设备'])}`,
        category: RandomData.pick(categories),
        brand: RandomData.pick(brands),
        price,
        cost,
        quantity: RandomData.number(0, 1000),
        reorderLevel: RandomData.number(10, 100),
        weight: RandomData.float(0.1, 50),
        status: RandomData.pick(['active', 'active', 'active', 'inactive']),
        isFeatured: Math.random() > 0.9,
        tags: ['新品', '热卖', '限时优惠'].slice(0, RandomData.number(0, 2)),
        rating: RandomData.float(0, 5, 1),
        reviews: RandomData.number(0, 1000),
        createdAt: RandomData.date(new Date(2024, 0, 1), new Date()),
        updatedAt: new Date(),
      });
    }

    const result = await prisma.product.createMany({
      data: products,
    });

    console.log(`   ✅ 创建了 ${result.count} 个产品`);
    return await prisma.product.findMany();
  }

  /**
   * 种子订单
   */
  private async seedOrders(users: any[], customers: any[], products: any[]): Promise<void> {
    const existingCount = await prisma.order.count();
    if (existingCount > 0) {
      console.log(`   ⚠️ 已存在 ${existingCount} 个订单，跳过种子`);
      return;
    }

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    const paymentMethods = ['wechat', 'alipay', 'bank_transfer', 'cash', 'credit_card'];

    const orders = [];

    for (let i = 0; i < (this.config.orders || 200); i++) {
      const customer = RandomData.pick(customers);
      const itemCount = RandomData.number(1, 5);
      const items = [];

      let totalAmount = 0;
      for (let j = 0; j < itemCount; j++) {
        const product = RandomData.pick(products);
        const quantity = RandomData.number(1, 5);
        const price = product.price || RandomData.float(10, 500);
        const total = price * quantity;
        totalAmount += total;

        items.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity,
          price,
          total,
        });
      }

      const discountAmount = RandomData.float(0, totalAmount * 0.15);
      const taxAmount = totalAmount * 0.13;
      const shippingAmount = RandomData.float(0, 50);
      const grandTotal = totalAmount - discountAmount + taxAmount + shippingAmount;

      orders.push({
        orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        items,
        totalAmount,
        discountAmount,
        taxAmount,
        shippingAmount,
        grandTotal,
        currency: 'CNY',
        status: RandomData.pick(statuses),
        paymentStatus: RandomData.pick(paymentStatuses),
        paymentMethod: RandomData.pick(paymentMethods),
        shippingAddress: {
          name: customer.name,
          address: customer.address || '默认地址',
          city: customer.city || '北京',
          country: customer.country || '中国',
          postalCode: customer.postalCode || '100000',
          phone: customer.phone || RandomData.phone(),
        },
        billingAddress: {
          name: customer.name,
          address: customer.address || '默认地址',
          city: customer.city || '北京',
          country: customer.country || '中国',
          postalCode: customer.postalCode || '100000',
          phone: customer.phone || RandomData.phone(),
        },
        trackingNumber: Math.random() > 0.5 ? RandomData.string(12).toUpperCase() : '',
        note: Math.random() > 0.7 ? '请尽快处理' : '',
        userId: RandomData.pick(users).id,
        createdAt: RandomData.date(new Date(2024, 0, 1), new Date()),
        updatedAt: new Date(),
        completedAt: Math.random() > 0.5 ? RandomData.date(new Date(2024, 6, 1), new Date()) : null,
      });
    }

    // 分批插入
    const batchSize = 50;
    let insertedCount = 0;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      const result = await prisma.order.createMany({
        data: batch,
      });
      insertedCount += result.count;
      console.log(`   📦 已创建 ${insertedCount}/${orders.length} 个订单`);
    }

    console.log(`   ✅ 创建了 ${insertedCount} 个订单`);
  }

  /**
   * 清空数据
   */
  async clear(): Promise<void> {
    console.log('🗑️ 清空数据...');

    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ 数据已清空');
  }
}

/**
 * 执行种子数据
 */
export async function seed(): Promise<void> {
  const seeder = new DatabaseSeeder();
  await seeder.seed();
}

/**
 * 清空数据
 */
export async function clear(): Promise<void> {
  const seeder = new DatabaseSeeder();
  await seeder.clear();
}

// 执行种子
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 种子数据完成！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 种子数据失败:', error);
      process.exit(1);
    });
}

export default DatabaseSeeder;