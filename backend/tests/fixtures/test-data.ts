/**
 * 通用测试数据
 * 提供测试用的通用数据
 * @module tests/fixtures/test-data
 */

import { faker } from '@faker-js/faker';
import { CustomerFixtures } from './customers';
import { OrderFixtures } from './orders';
import { ProductFixtures } from './products';

/**
 * 测试数据集合
 */
export interface TestDataCollection {
  customers: any[];
  products: any[];
  orders: any[];
  users: any[];
}

/**
 * 通用测试数据生成器
 */
export class TestDataFixtures {
  /**
   * 生成完整测试数据集
   */
  static generateFullTestData(options: {
    customers?: number;
    products?: number;
    orders?: number;
    users?: number;
  } = {}): TestDataCollection {
    const config = {
      customers: options.customers || 10,
      products: options.products || 20,
      orders: options.orders || 30,
      users: options.users || 5,
    };

    // 生成用户
    const users = this.generateUsers(config.users);

    // 生成客户
    const customers = CustomerFixtures.generateMany(config.customers);

    // 生成产品
    const products = ProductFixtures.generateMany(config.products);

    // 生成订单
    const customerIds = customers.map((c) => c.id || faker.string.uuid());
    const productIds = products.map((p) => p.id || faker.string.uuid());
    const orders = OrderFixtures.generateMany(config.orders, faker.helpers.arrayElement(customerIds), productIds);

    return {
      customers,
      products,
      orders,
      users,
    };
  }

  /**
   * 生成测试用户
   */
  static generateUsers(count: number = 5): any[] {
    const roles = ['admin', 'manager', 'employee', 'finance', 'hr'];

    return Array.from({ length: count }, (_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        id: faker.string.uuid(),
        username: faker.internet.username({ firstName, lastName }),
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        roles: [faker.helpers.arrayElement(roles)],
        isActive: true,
        isVerified: true,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: new Date(),
      };
    });
  }

  /**
   * 生成认证测试数据
   */
  static getAuthTestData(): any {
    return {
      loginValid: {
        email: 'admin@example.com',
        password: 'Admin@123456',
      },
      loginInvalid: {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      },
      registerValid: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Test@123456',
        firstName: '新',
        lastName: '用户',
      },
      registerInvalid: {
        username: 'a',
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: '',
      },
    };
  }

  /**
   * 获取分页测试数据
   */
  static getPaginationTestData(): any {
    return {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  }

  /**
   * 获取搜索测试数据
   */
  static getSearchTestData(): any {
    return {
      search: 'test',
      category: '电子产品',
      brand: 'Apple',
      status: 'active',
      minPrice: 100,
      maxPrice: 1000,
    };
  }

  /**
   * 获取日期范围测试数据
   */
  static getDateRangeTestData(): any {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  /**
   * 获取错误响应测试数据
   */
  static getErrorTestData(): any {
    return {
      validationError: {
        field: 'email',
        message: '邮箱格式无效',
        value: 'invalid-email',
      },
      notFoundError: {
        message: '资源不存在',
        code: 'NOT_FOUND',
      },
      unauthorizedError: {
        message: '未认证',
        code: 'UNAUTHORIZED',
      },
      forbiddenError: {
        message: '无权限',
        code: 'FORBIDDEN',
      },
      conflictError: {
        message: '资源冲突',
        code: 'CONFLICT',
      },
    };
  }

  /**
   * 获取批量操作测试数据
   */
  static getBulkTestData(): any {
    return {
      ids: ['id_1', 'id_2', 'id_3'],
      action: 'delete',
      data: { reason: '批量删除' },
    };
  }

  /**
   * 获取测试环境配置
   */
  static getTestConfig(): any {
    return {
      apiBaseUrl: process.env.TEST_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
  }

  /**
   * 获取Mock响应数据
   */
  static getMockResponses(): any {
    return {
      success: {
        success: true,
        message: '操作成功',
      },
      paginated: {
        success: true,
        data: {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      },
      error: {
        success: false,
        message: '操作失败',
        code: 'ERROR',
      },
    };
  }
}

export default TestDataFixtures;