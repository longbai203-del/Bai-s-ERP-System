/**
 * 订单测试夹具
 * 提供测试用的订单数据
 * @module tests/fixtures/orders
 */

import { faker } from '@faker-js/faker';

/**
 * 订单测试数据生成器
 */
export class OrderFixtures {
  /**
   * 生成单个订单数据
   */
  static generateOne(customerId: string, productIds: string[], overrides: any = {}): any {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partial'];
    const paymentMethods = ['wechat', 'alipay', 'bank_transfer', 'cash', 'credit_card'];

    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < itemCount; i++) {
      const productId = faker.helpers.arrayElement(productIds);
      const quantity = faker.number.int({ min: 1, max: 10 });
      const price = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
      const total = price * quantity;
      totalAmount += total;

      items.push({
        productId,
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric(10).toUpperCase(),
        quantity,
        price,
        total,
      });
    }

    const discountAmount = faker.helpers.maybe(() => faker.number.float({ min: 0, max: totalAmount * 0.2, fractionDigits: 2 }), { probability: 0.3 }) || 0;
    const taxAmount = totalAmount * 0.13;
    const shippingAmount = faker.number.float({ min: 0, max: 50, fractionDigits: 2 });
    const grandTotal = totalAmount - discountAmount + taxAmount + shippingAmount;

    return {
      orderNumber: `ORD-${faker.string.alphanumeric(6).toUpperCase()}`,
      customerId,
      items,
      totalAmount,
      discountAmount,
      taxAmount,
      shippingAmount,
      grandTotal,
      currency: 'CNY',
      status: faker.helpers.arrayElement(statuses),
      paymentStatus: faker.helpers.arrayElement(paymentStatuses),
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
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
      userId: faker.string.uuid(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
      completedAt: faker.helpers.maybe(() => faker.date.recent({ days: 30 }), { probability: 0.5 }),
      ...overrides,
    };
  }

  /**
   * 生成多个订单数据
   */
  static generateMany(count: number, customerId: string, productIds: string[], overrides: any = {}): any[] {
    return Array.from({ length: count }, () => this.generateOne(customerId, productIds, overrides));
  }

  /**
   * 获取测试用的订单数据
   */
  static getTestOrders(): any[] {
    const customerId = 'cust_1';
    const productIds = ['prod_1', 'prod_2', 'prod_3'];

    return [
      {
        id: 'order_1',
        orderNumber: 'ORD-000001',
        customerId,
        items: [
          { productId: 'prod_1', name: '智能手表', sku: 'SKU-00000001', quantity: 2, price: 299.00, total: 598.00 },
          { productId: 'prod_2', name: '蓝牙耳机', sku: 'SKU-00000002', quantity: 1, price: 99.00, total: 99.00 },
        ],
        totalAmount: 697.00,
        discountAmount: 50.00,
        taxAmount: 90.61,
        shippingAmount: 0.00,
        grandTotal: 737.61,
        currency: 'CNY',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'wechat',
        shippingAddress: {
          name: '张三',
          address: '北京市朝阳区建国路88号',
          city: '北京',
          country: '中国',
          postalCode: '100020',
          phone: '+86-13800010001',
        },
        billingAddress: {
          name: '张三',
          address: '北京市朝阳区建国路88号',
          city: '北京',
          country: '中国',
          postalCode: '100020',
          phone: '+86-13800010001',
        },
        trackingNumber: 'SF1234567890',
        note: '请尽快发货',
        userId: 'user_1',
        createdAt: new Date('2024-07-10'),
        updatedAt: new Date('2024-07-15'),
        completedAt: new Date('2024-07-15'),
      },
      {
        id: 'order_2',
        orderNumber: 'ORD-000002',
        customerId,
        items: [
          { productId: 'prod_3', name: '笔记本电脑', sku: 'SKU-00000003', quantity: 1, price: 4999.00, total: 4999.00 },
        ],
        totalAmount: 4999.00,
        discountAmount: 200.00,
        taxAmount: 649.87,
        shippingAmount: 30.00,
        grandTotal: 5478.87,
        currency: 'CNY',
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'alipay',
        shippingAddress: {
          name: '张三',
          address: '北京市朝阳区建国路88号',
          city: '北京',
          country: '中国',
          postalCode: '100020',
          phone: '+86-13800010001',
        },
        billingAddress: {
          name: '张三',
          address: '北京市朝阳区建国路88号',
          city: '北京',
          country: '中国',
          postalCode: '100020',
          phone: '+86-13800010001',
        },
        trackingNumber: 'SF9876543210',
        note: '',
        userId: 'user_1',
        createdAt: new Date('2024-07-18'),
        updatedAt: new Date('2024-07-20'),
        completedAt: null,
      },
      {
        id: 'order_3',
        orderNumber: 'ORD-000003',
        customerId: 'cust_2',
        items: [
          { productId: 'prod_1', name: '智能手表', sku: 'SKU-00000001', quantity: 1, price: 299.00, total: 299.00 },
          { productId: 'prod_4', name: '无线音箱', sku: 'SKU-00000004', quantity: 2, price: 199.00, total: 398.00 },
        ],
        totalAmount: 697.00,
        discountAmount: 0,
        taxAmount: 90.61,
        shippingAmount: 15.00,
        grandTotal: 802.61,
        currency: 'CNY',
        status: 'processing',
        paymentStatus: 'pending',
        paymentMethod: 'credit_card',
        shippingAddress: {
          name: '李四',
          address: '上海市浦东新区世纪大道100号',
          city: '上海',
          country: '中国',
          postalCode: '200120',
          phone: '+86-13800010002',
        },
        billingAddress: {
          name: '李四',
          address: '上海市浦东新区世纪大道100号',
          city: '上海',
          country: '中国',
          postalCode: '200120',
          phone: '+86-13800010002',
        },
        trackingNumber: '',
        note: '需要发票',
        userId: 'user_2',
        createdAt: new Date('2024-07-22'),
        updatedAt: new Date('2024-07-22'),
        completedAt: null,
      },
    ];
  }

  /**
   * 获取无效的订单数据（用于测试验证）
   */
  static getInvalidOrders(): any[] {
    return [
      { customerId: '', items: [] },
      { customerId: 'cust_1', items: [{ productId: '', quantity: 0, price: -10 }] },
      { customerId: 'cust_1', items: [{ productId: 'prod_1', quantity: 0, price: 100 }] },
    ];
  }

  /**
   * 获取状态更新数据
   */
  static getStatusUpdateData(): any {
    return {
      status: 'confirmed',
      reason: '订单已确认',
    };
  }
}

export default OrderFixtures;