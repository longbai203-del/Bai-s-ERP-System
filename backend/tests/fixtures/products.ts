/**
 * 产品测试夹具
 * 提供测试用的产品数据
 * @module tests/fixtures/products
 */

import { faker } from '@faker-js/faker';

/**
 * 产品测试数据生成器
 */
export class ProductFixtures {
  /**
   * 生成单个产品数据
   */
  static generateOne(overrides: any = {}): any {
    const categories = ['电子产品', '服装服饰', '食品饮料', '家居用品', '办公用品', '工业设备'];
    const brands = ['Apple', 'Samsung', 'Nike', 'Sony', 'Dell', 'HP', 'Lenovo', 'Xiaomi'];
    const statuses = ['active', 'inactive', 'discontinued'];

    const name = faker.commerce.productName();
    const price = faker.number.float({ min: 10, max: 5000, fractionDigits: 2 });
    const cost = price * faker.number.float({ min: 0.3, max: 0.8, fractionDigits: 2 });

    return {
      name,
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(categories),
      brand: faker.helpers.arrayElement(brands),
      price,
      cost,
      quantity: faker.number.int({ min: 0, max: 1000 }),
      reorderLevel: faker.number.int({ min: 10, max: 100 }),
      weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
      dimensions: {
        length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        height: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        unit: 'cm',
      },
      images: [
        faker.image.url({ width: 400, height: 400 }),
        faker.image.url({ width: 400, height: 400 }),
      ],
      status: faker.helpers.arrayElement(statuses),
      isFeatured: faker.datatype.boolean({ probability: 0.1 }),
      tags: faker.helpers.arrayElements(['New', 'Sale', 'Popular', 'Limited', 'Premium'], { min: 0, max: 3 }),
      rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 0, max: 1000 }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * 生成多个产品数据
   */
  static generateMany(count: number = 10, overrides: any = {}): any[] {
    return Array.from({ length: count }, () => this.generateOne(overrides));
  }

  /**
   * 获取测试用的产品数据
   */
  static getTestProducts(): any[] {
    return [
      {
        id: 'prod_1',
        name: 'iPhone 15 Pro Max',
        sku: 'SKU-IP15PM',
        description: '最新款iPhone，搭载A17 Pro芯片，钛金属边框',
        category: '电子产品',
        brand: 'Apple',
        price: 9999.00,
        cost: 7500.00,
        quantity: 50,
        reorderLevel: 20,
        weight: 0.22,
        dimensions: { length: 16.0, width: 7.8, height: 0.8, unit: 'cm' },
        images: ['https://example.com/iphone15.jpg'],
        status: 'active',
        isFeatured: true,
        tags: ['New', 'Premium'],
        rating: 4.9,
        reviews: 1280,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01'),
      },
      {
        id: 'prod_2',
        name: 'Samsung Galaxy S24 Ultra',
        sku: 'SKU-S24U',
        description: 'Galaxy S24 Ultra，搭载骁龙8 Gen 3，AI功能强大',
        category: '电子产品',
        brand: 'Samsung',
        price: 8999.00,
        cost: 6500.00,
        quantity: 30,
        reorderLevel: 15,
        weight: 0.23,
        dimensions: { length: 16.2, width: 7.9, height: 0.9, unit: 'cm' },
        images: ['https://example.com/s24ultra.jpg'],
        status: 'active',
        isFeatured: false,
        tags: ['Popular'],
        rating: 4.8,
        reviews: 856,
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-08-15'),
      },
      {
        id: 'prod_3',
        name: 'MacBook Pro 16"',
        sku: 'SKU-MBP16',
        description: '16英寸MacBook Pro，M3 Max芯片，专业级性能',
        category: '电子产品',
        brand: 'Apple',
        price: 24999.00,
        cost: 19000.00,
        quantity: 20,
        reorderLevel: 10,
        weight: 2.15,
        dimensions: { length: 35.6, width: 24.8, height: 1.7, unit: 'cm' },
        images: ['https://example.com/mbp16.jpg'],
        status: 'active',
        isFeatured: true,
        tags: ['Premium', 'Professional'],
        rating: 4.9,
        reviews: 234,
        createdAt: new Date('2024-07-20'),
        updatedAt: new Date('2024-07-20'),
      },
      {
        id: 'prod_4',
        name: 'Sony WH-1000XM5',
        sku: 'SKU-XM5',
        description: '顶级降噪耳机，卓越音质，30小时续航',
        category: '电子产品',
        brand: 'Sony',
        price: 2999.00,
        cost: 2000.00,
        quantity: 100,
        reorderLevel: 30,
        weight: 0.25,
        dimensions: { length: 8.0, width: 7.5, height: 3.0, unit: 'cm' },
        images: ['https://example.com/xm5.jpg'],
        status: 'active',
        isFeatured: false,
        tags: ['Popular', 'New'],
        rating: 4.7,
        reviews: 1567,
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-06-01'),
      },
      {
        id: 'prod_5',
        name: 'Nike Air Max 270',
        sku: 'SKU-AM270',
        description: 'Air Max 270，超大Air气垫，舒适缓震',
        category: '服装服饰',
        brand: 'Nike',
        price: 1299.00,
        cost: 800.00,
        quantity: 200,
        reorderLevel: 50,
        weight: 0.32,
        dimensions: { length: 30.0, width: 20.0, height: 12.0, unit: 'cm' },
        images: ['https://example.com/am270.jpg'],
        status: 'active',
        isFeatured: false,
        tags: ['Sale'],
        rating: 4.5,
        reviews: 890,
        createdAt: new Date('2024-05-15'),
        updatedAt: new Date('2024-05-15'),
      },
    ];
  }

  /**
   * 获取无效的产品数据（用于测试验证）
   */
  static getInvalidProducts(): any[] {
    return [
      { name: '', sku: 'SKU-001', price: 100 },
      { name: '测试产品', sku: '', price: 100 },
      { name: '测试产品', sku: 'SKU-001', price: -10 },
      { name: '测试产品', sku: 'SKU-001', price: 100, quantity: -5 },
      { name: '测试产品', sku: 'SKU-001', price: 100, status: 'invalid_status' },
    ];
  }

  /**
   * 获取更新用的产品数据
   */
  static getUpdateData(): any {
    return {
      name: '更新后的产品名称',
      sku: 'SKU-UPDATED',
      description: '更新后的产品描述',
      category: '更新分类',
      brand: '更新品牌',
      price: 1999.99,
      cost: 1200.00,
      quantity: 150,
      reorderLevel: 25,
      weight: 1.5,
      dimensions: { length: 20, width: 15, height: 10, unit: 'cm' },
      images: ['https://example.com/updated.jpg'],
      status: 'active',
      isFeatured: true,
      tags: ['Updated', 'New'],
    };
  }

  /**
   * 获取库存更新数据
   */
  static getStockUpdateData(): any {
    return {
      quantity: 100,
      reason: '补货入库',
      reference: 'PO-2024-001',
    };
  }
}

export default ProductFixtures;