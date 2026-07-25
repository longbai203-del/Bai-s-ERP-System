/**
 * 产品种子数据
 * 生成测试产品数据
 * @module seeders/products.seeder
 */

import { Db } from 'mongodb';
import { faker } from '@faker-js/faker';

/**
 * 产品种子数据生成器
 */
export class ProductsSeeder {
  private static instance: ProductsSeeder;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): ProductsSeeder {
    if (!ProductsSeeder.instance) {
      ProductsSeeder.instance = new ProductsSeeder();
    }
    return ProductsSeeder.instance;
  }

  /**
   * 生成产品数据
   */
  private generateProduct(index: number): any {
    const categories = ['电子产品', '服装服饰', '食品饮料', '家居用品', '办公用品', '工业设备', '汽车配件', '运动户外'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Xiaomi', 'Huawei', 'Toyota', 'BMW'];

    const name = faker.commerce.productName();
    const category = faker.helpers.arrayElement(categories);
    const brand = faker.helpers.arrayElement(brands);
    const price = faker.number.float({ min: 10, max: 5000, fractionDigits: 2 });
    const cost = price * faker.number.float({ min: 0.3, max: 0.8, fractionDigits: 2 });
    const quantity = faker.number.int({ min: 0, max: 1000 });
    const reorderLevel = faker.number.int({ min: 10, max: 100 });

    return {
      name,
      sku: `SKU-${String(index + 1).padStart(8, '0')}`,
      description: faker.commerce.productDescription(),
      category,
      brand,
      price,
      cost,
      quantity,
      reorderLevel,
      weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
      dimensions: {
        length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        height: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        unit: 'cm',
      },
      images: faker.helpers.arrayElements([
        faker.image.url({ width: 400, height: 400 }),
        faker.image.url({ width: 400, height: 400 }),
      ], { min: 1, max: 3 }),
      status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive', 'discontinued']),
      isFeatured: faker.datatype.boolean({ probability: 0.1 }),
      tags: faker.helpers.arrayElements(['New', 'Sale', 'Popular', 'Limited', 'Premium', 'Eco-friendly', 'Smart'], { min: 0, max: 3 }),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 0, max: 1000 }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
    };
  }

  /**
   * 执行种子数据生成
   */
  async seed(db: Db, count: number = 100): Promise<number> {
    console.log(`[ProductsSeeder] 开始生成 ${count} 条产品数据...`);

    const collection = db.collection('products');
    const products = [];

    for (let i = 0; i < count; i++) {
      products.push(this.generateProduct(i));
    }

    // 分批插入
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      try {
        const result = await collection.insertMany(batch, { ordered: false });
        insertedCount += result.insertedCount;
        console.log(`[ProductsSeeder] 已插入 ${insertedCount}/${products.length}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`[ProductsSeeder] 跳过重复数据`);
        } else {
          console.error(`[ProductsSeeder] 插入失败:`, error);
        }
      }
    }

    console.log(`[ProductsSeeder] 完成，共插入 ${insertedCount} 条记录`);
    return insertedCount;
  }

  /**
   * 清空产品数据
   */
  async clear(db: Db): Promise<number> {
    const collection = db.collection('products');
    const result = await collection.deleteMany({});
    console.log(`[ProductsSeeder] 已清空 ${result.deletedCount} 条记录`);
    return result.deletedCount || 0;
  }
}

/**
 * 执行种子数据生成（便捷函数）
 */
export async function seed(db: Db, count: number = 100): Promise<number> {
  const seeder = ProductsSeeder.getInstance();
  return seeder.seed(db, count);
}

/**
 * 清空产品数据（便捷函数）
 */
export async function clear(db: Db): Promise<number> {
  const seeder = ProductsSeeder.getInstance();
  return seeder.clear(db);
}

export default ProductsSeeder;