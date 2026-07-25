/**
 * 客户种子数据
 * 生成测试客户数据
 * @module seeders/customers.seeder
 */

import { Db } from 'mongodb';
import { faker } from '@faker-js/faker';

/**
 * 客户种子数据生成器
 */
export class CustomersSeeder {
  private static instance: CustomersSeeder;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): CustomersSeeder {
    if (!CustomersSeeder.instance) {
      CustomersSeeder.instance = new CustomersSeeder();
    }
    return CustomersSeeder.instance;
  }

  /**
   * 生成客户数据
   */
  private generateCustomer(index: number): any {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const statuses = ['active', 'active', 'active', 'inactive', 'vip', 'lead'];
    const industries = ['Technology', 'Retail', 'Manufacturing', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Real Estate'];

    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
      taxId: faker.string.alphanumeric(10).toUpperCase(),
      industry: faker.helpers.arrayElement(industries),
      status: faker.helpers.arrayElement(statuses),
      tags: faker.helpers.arrayElements(['VIP', 'Enterprise', 'Startup', 'Long-term', 'New', 'International'], { min: 0, max: 3 }),
      totalOrders: faker.number.int({ min: 0, max: 50 }),
      totalSpent: faker.number.float({ min: 0, max: 100000, fractionDigits: 2 }),
      lastOrderAt: faker.date.past({ years: 1 }),
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
    };
  }

  /**
   * 执行种子数据生成
   */
  async seed(db: Db, count: number = 100): Promise<number> {
    console.log(`[CustomersSeeder] 开始生成 ${count} 条客户数据...`);

    const collection = db.collection('customers');
    const customers = [];

    for (let i = 0; i < count; i++) {
      customers.push(this.generateCustomer(i));
    }

    // 分批插入
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(i, i + batchSize);
      try {
        const result = await collection.insertMany(batch, { ordered: false });
        insertedCount += result.insertedCount;
        console.log(`[CustomersSeeder] 已插入 ${insertedCount}/${customers.length}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`[CustomersSeeder] 跳过重复数据`);
        } else {
          console.error(`[CustomersSeeder] 插入失败:`, error);
        }
      }
    }

    console.log(`[CustomersSeeder] 完成，共插入 ${insertedCount} 条记录`);
    return insertedCount;
  }

  /**
   * 清空客户数据
   */
  async clear(db: Db): Promise<number> {
    const collection = db.collection('customers');
    const result = await collection.deleteMany({});
    console.log(`[CustomersSeeder] 已清空 ${result.deletedCount} 条记录`);
    return result.deletedCount || 0;
  }
}

/**
 * 执行种子数据生成（便捷函数）
 */
export async function seed(db: Db, count: number = 100): Promise<number> {
  const seeder = CustomersSeeder.getInstance();
  return seeder.seed(db, count);
}

/**
 * 清空客户数据（便捷函数）
 */
export async function clear(db: Db): Promise<number> {
  const seeder = CustomersSeeder.getInstance();
  return seeder.clear(db);
}

export default CustomersSeeder;