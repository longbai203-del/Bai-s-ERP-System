/**
 * 客户测试夹具
 * 提供测试用的客户数据
 * @module tests/fixtures/customers
 */

import { faker } from '@faker-js/faker';

/**
 * 客户测试数据生成器
 */
export class CustomerFixtures {
  /**
   * 生成单个客户数据
   */
  static generateOne(overrides: any = {}): any {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const statuses = ['active', 'inactive', 'lead', 'vip'];

    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
      taxId: faker.string.alphanumeric(10).toUpperCase(),
      industry: faker.helpers.arrayElement(['Technology', 'Retail', 'Manufacturing', 'Finance']),
      status: faker.helpers.arrayElement(statuses),
      tags: faker.helpers.arrayElements(['VIP', 'Enterprise', 'Startup'], { min: 0, max: 2 }),
      totalOrders: faker.number.int({ min: 0, max: 50 }),
      totalSpent: faker.number.float({ min: 0, max: 100000, fractionDigits: 2 }),
      lastOrderAt: faker.date.past({ years: 1 }),
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * 生成多个客户数据
   */
  static generateMany(count: number = 10, overrides: any = {}): any[] {
    return Array.from({ length: count }, () => this.generateOne(overrides));
  }

  /**
   * 获取测试用的客户数据
   */
  static getTestCustomers(): any[] {
    return [
      {
        id: 'cust_1',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '+86-13800010001',
        address: '北京市朝阳区建国路88号',
        city: '北京',
        country: '中国',
        postalCode: '100020',
        taxId: '1234567890',
        industry: 'Technology',
        status: 'active',
        tags: ['VIP', 'Enterprise'],
        totalOrders: 25,
        totalSpent: 158000.00,
        lastOrderAt: new Date('2024-07-15'),
        notes: '重要客户',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-07-15'),
      },
      {
        id: 'cust_2',
        name: '李四',
        email: 'lisi@example.com',
        phone: '+86-13800010002',
        address: '上海市浦东新区世纪大道100号',
        city: '上海',
        country: '中国',
        postalCode: '200120',
        taxId: '0987654321',
        industry: 'Retail',
        status: 'vip',
        tags: ['VIP'],
        totalOrders: 45,
        totalSpent: 230000.00,
        lastOrderAt: new Date('2024-07-20'),
        notes: 'VIP客户',
        createdAt: new Date('2022-06-01'),
        updatedAt: new Date('2024-07-20'),
      },
      {
        id: 'cust_3',
        name: '王五',
        email: 'wangwu@example.com',
        phone: '+86-13800010003',
        address: '广州市天河区天河路123号',
        city: '广州',
        country: '中国',
        postalCode: '510620',
        taxId: '5678901234',
        industry: 'Manufacturing',
        status: 'active',
        tags: ['Enterprise'],
        totalOrders: 12,
        totalSpent: 68000.00,
        lastOrderAt: new Date('2024-07-10'),
        notes: '',
        createdAt: new Date('2023-08-15'),
        updatedAt: new Date('2024-07-10'),
      },
      {
        id: 'cust_4',
        name: '赵六',
        email: 'zhaoliu@example.com',
        phone: '+86-13800010004',
        address: '深圳市南山区科技园科苑路1号',
        city: '深圳',
        country: '中国',
        postalCode: '518057',
        taxId: '4321098765',
        industry: 'Finance',
        status: 'inactive',
        tags: [],
        totalOrders: 3,
        totalSpent: 8500.00,
        lastOrderAt: new Date('2024-03-01'),
        notes: '长期未活跃',
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2024-03-01'),
      },
      {
        id: 'cust_5',
        name: '孙七',
        email: 'sunqi@example.com',
        phone: '+86-13800010005',
        address: '杭州市西湖区文三路100号',
        city: '杭州',
        country: '中国',
        postalCode: '310012',
        taxId: '6789012345',
        industry: 'Education',
        status: 'lead',
        tags: ['Startup'],
        totalOrders: 0,
        totalSpent: 0,
        lastOrderAt: null,
        notes: '潜在客户，正在跟进',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-06-01'),
      },
    ];
  }

  /**
   * 获取无效的客户数据（用于测试验证）
   */
  static getInvalidCustomers(): any[] {
    return [
      { name: '', email: 'invalid-email', phone: '123' },
      { name: 'A'.repeat(300), email: 'test@example.com', phone: '+86-13800010001' },
      { name: '测试客户', email: '', phone: '+86-13800010001' },
      { name: '测试客户', email: 'test@example.com', phone: '' },
      { name: '测试客户', email: 'test@example.com', phone: '+86-13800010001', status: 'invalid_status' },
    ];
  }

  /**
   * 获取更新用的客户数据
   */
  static getUpdateData(): any {
    return {
      name: '更新后的客户名称',
      email: 'updated@example.com',
      phone: '+86-13800019999',
      address: '更新后的地址',
      city: '更新后的城市',
      country: '更新后的国家',
      postalCode: '999999',
      taxId: 'UPDATED_TAX_ID',
      industry: 'Consulting',
      status: 'vip',
      tags: ['VIP', 'Updated'],
      notes: '更新后的备注信息',
    };
  }
}

export default CustomerFixtures;