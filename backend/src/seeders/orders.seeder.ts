/**
 * 订单种子数据
 * 生成测试订单数据
 * @module seeders/orders.seeder
 */

import { Db, ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

/**
 * 订单种子数据生成器
 */
export class OrdersSeeder {
  private static instance: OrdersSeeder;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): OrdersSeeder {
    if (!OrdersSeeder.instance) {
      OrdersSeeder.instance = new OrdersSeeder();
    }
    return OrdersSeeder.instance;
  }

  /**
   * 生成订单项
   */
  private generateOrderItems(productIds: string[]): any[] {
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = [];

    for (let i = 0; i < itemCount; i++) {
      const productId = faker.helpers.arrayElement(productIds);
      const quantity = faker.number.int({ min: 1, max: 10 });
      const price = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });

      items.push({
        productId,
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(10).toUpperCase(),
        quantity,
        price,
        total: quantity * price,
      });
    }

    return items;
  }

  /**
   * 生成订单数据
   */
  private generateOrder(customerIds: string[], productIds: string[], index: number): any {
    const customerId = faker.helpers.arrayElement(customerIds);
    const items = this.generateOrderItems(productIds);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = faker.helpers.maybe(() => faker.number.float({ min: 0, max: totalAmount * 0.2, fractionDigits: 2 }), { probability: 0.3 }) || 0;
    const taxAmount = totalAmount * 0.13;
    const shippingAmount = faker.number.float({ min: 0, max: 50, fractionDigits: 2 });
    const grandTotal = totalAmount - discountAmount + taxAmount + shippingAmount;

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partial'];

    return {
      orderNumber: `ORD-${String(index + 1).padStart(6, '0')}`,
      customerId: customerId,
      items,
      totalAmount,
      discountAmount,
      taxAmount,
      shippingAmount,
      grandTotal,
      currency: 'CNY',
      status: faker.helpers.arrayElement(statuses),
      paymentStatus: faker.helpers.arrayElement(paymentStatuses),
      shippingAddress: {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        phone: faker.phone.number(),
      },
      billingAddress: {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        phone: faker.phone.number(),
      },
      trackingNumber: faker.helpers.maybe(() => faker.string.alphanumeric(12).toUpperCase(), { probability: 0.4 }),
      note: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
      completedAt: faker.helpers.maybe(() => faker.date.recent({ days: 30 }), { probability: 0.5 }),
    };
  }

  /**
   * 获取现有客户ID
   */
  private async getCustomerIds(db: Db): Promise<string[]> {
    const customers = await db.collection('customers').find({}, { projection: { _id: 1 } }).toArray();
    return customers.map((c) => c._id.toString());
  }

  /**
   * 获取现有产品ID
   */
  private async getProductIds(db: Db): Promise<string[]> {
    const products = await db.collection('products').find({}, { projection: { _id: 1 } }).toArray();
    return products.map((p) => p._id.toString());
  }

  /**
   * 执行种子数据生成
   */
  async seed(db: Db, count: number = 200): Promise<number> {
    console.log(`[OrdersSeeder] 开始生成 ${count} 条订单数据...`);

    // 获取现有客户和产品ID
    const customerIds = await this.getCustomerIds(db);
    const productIds = await this.getProductIds(db);

    if (customerIds.length === 0 || productIds.length === 0) {
      console.warn('[OrdersSeeder] 请先运行客户和产品种子数据');
      return 0;
    }

    const collection = db.collection('orders');
    const orders = [];

    for (let i = 0; i < count; i++) {
      orders.push(this.generateOrder(customerIds, productIds, i));
    }

    // 分批插入
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      try {
        const result = await collection.insertMany(batch, { ordered: false });
        insertedCount += result.insertedCount;
        console.log(`[OrdersSeeder] 已插入 ${insertedCount}/${orders.length}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`[OrdersSeeder] 跳过重复数据`);
        } else {
          console.error(`[OrdersSeeder] 插入失败:`, error);
        }
      }
    }

    console.log(`[OrdersSeeder] 完成，共插入 ${insertedCount} 条记录`);
    return insertedCount;
  }

  /**
   * 清空订单数据
   */
  async clear(db: Db): Promise<number> {
    const collection = db.collection('orders');
    const result = await collection.deleteMany({});
    console.log(`[OrdersSeeder] 已清空 ${result.deletedCount} 条记录`);
    return result.deletedCount || 0;
  }
}

/**
 * 执行种子数据生成（便捷函数）
 */
export async function seed(db: Db, count: number = 200): Promise<number> {
  const seeder = OrdersSeeder.getInstance();
  return seeder.seed(db, count);
}

/**
 * 清空订单数据（便捷函数）
 */
export async function clear(db: Db): Promise<number> {
  const seeder = OrdersSeeder.getInstance();
  return seeder.clear(db);
}

export default OrdersSeeder;