/**
 * Swagger/OpenAPI 配置
 * 完整的API文档配置
 * @module docs/swagger.config
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

/**
 * Swagger配置接口
 */
export interface SwaggerConfig {
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 版本 */
  version?: string;
  /** API基础路径 */
  basePath?: string;
  /** 服务器列表 */
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  /** 安全定义 */
  securityDefinitions?: Record<string, any>;
  /** 标签 */
  tags?: Array<{
    name: string;
    description: string;
  }>;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * 默认Swagger配置
 */
export const DEFAULT_SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Bai\'s ERP System API',
  description: `
    ## Bai's ERP 系统 API 文档
    
    本系统提供完整的ERP功能API接口，包括：
    - 👤 用户认证与权限管理
    - 👥 客户管理
    - 📦 产品管理
    - 📋 订单管理
    - 📊 库存管理
    - 💰 财务管理
    - 👔 人力资源管理
    - 📈 报表与分析
    
    ### 认证方式
    使用 JWT Bearer Token 进行认证
    \`\`\`
    Authorization: Bearer <your_token>
    \`\`\`
    
    ### 响应格式
    所有API统一返回格式：
    \`\`\`json
    {
      "success": true,
      "data": {...},
      "message": "操作成功"
    }
    \`\`\`
  `,
  version: '1.0.0',
  basePath: '/api/v1',
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: '开发服务器',
    },
    {
      url: 'https://api.baierp.com/api/v1',
      description: '生产服务器',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
  },
  tags: [
    { name: '系统', description: '系统相关接口' },
    { name: '认证', description: '用户认证相关接口' },
    { name: '用户', description: '用户管理相关接口' },
    { name: '客户', description: '客户管理相关接口' },
    { name: '产品', description: '产品管理相关接口' },
    { name: '订单', description: '订单管理相关接口' },
    { name: '库存', description: '库存管理相关接口' },
    { name: '财务', description: '财务管理相关接口' },
    { name: 'HR', description: '人力资源管理相关接口' },
    { name: '报表', description: '报表与统计相关接口' },
  ],
  enabled: true,
};

/**
 * Swagger配置管理器
 */
export class SwaggerConfigManager {
  private config: SwaggerConfig;

  constructor(config: Partial<SwaggerConfig> = {}) {
    this.config = {
      ...DEFAULT_SWAGGER_CONFIG,
      ...config,
    };
  }

  /**
   * 获取Swagger文档配置
   */
  getSwaggerOptions(): swaggerJsdoc.Options {
    return {
      definition: {
        openapi: '3.0.0',
        info: {
          title: this.config.title,
          description: this.config.description,
          version: this.config.version,
          contact: {
            name: 'Bai\'s ERP System Team',
            email: 'support@baierp.com',
            url: 'https://www.baierp.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: this.config.servers,
        tags: this.config.tags,
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
          schemas: this.getSchemas(),
          responses: this.getResponses(),
          parameters: this.getParameters(),
        },
        security: [{ bearerAuth: [] }],
        paths: this.getPaths(),
      },
      apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
    };
  }

  /**
   * 获取Schema定义
   */
  private getSchemas(): Record<string, any> {
    return {
      // 通用响应
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          code: { type: 'string' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array' },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
          message: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          code: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
                value: { type: 'string' },
              },
            },
          },
        },
      },

      // 用户相关
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          roles: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          isVerified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          roles: { type: 'array', items: { type: 'string' } },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              refreshToken: { type: 'string' },
              user: { $ref: '#/components/schemas/User' },
            },
          },
          message: { type: 'string' },
        },
      },

      // 客户相关
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' },
          postalCode: { type: 'string' },
          taxId: { type: 'string' },
          industry: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'lead', 'vip'] },
          tags: { type: 'array', items: { type: 'string' } },
          totalOrders: { type: 'integer' },
          totalSpent: { type: 'number' },
          lastOrderAt: { type: 'string', format: 'date-time' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCustomerRequest: {
        type: 'object',
        required: ['name', 'email', 'phone'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 200 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', pattern: '^[\\+\\d\\s\\-()]{7,20}$' },
          address: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' },
          postalCode: { type: 'string' },
          taxId: { type: 'string' },
          industry: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'lead', 'vip'] },
          tags: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' },
        },
      },

      // 产品相关
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          sku: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          brand: { type: 'string' },
          price: { type: 'number' },
          cost: { type: 'number' },
          quantity: { type: 'integer' },
          reorderLevel: { type: 'integer' },
          weight: { type: 'number' },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
              unit: { type: 'string', enum: ['cm', 'in', 'mm'] },
            },
          },
          images: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['active', 'inactive', 'discontinued'] },
          isFeatured: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
          rating: { type: 'number' },
          reviews: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'sku', 'price'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 200 },
          sku: { type: 'string', minLength: 1, maxLength: 50 },
          description: { type: 'string' },
          category: { type: 'string' },
          brand: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          cost: { type: 'number', minimum: 0 },
          quantity: { type: 'integer', minimum: 0 },
          reorderLevel: { type: 'integer', minimum: 0 },
          weight: { type: 'number', minimum: 0 },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number', minimum: 0 },
              width: { type: 'number', minimum: 0 },
              height: { type: 'number', minimum: 0 },
              unit: { type: 'string', enum: ['cm', 'in', 'mm'] },
            },
          },
          images: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['active', 'inactive', 'discontinued'] },
          isFeatured: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },

      // 订单相关
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          orderNumber: { type: 'string' },
          customerId: { type: 'string' },
          customer: { $ref: '#/components/schemas/Customer' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                productName: { type: 'string' },
                sku: { type: 'string' },
                quantity: { type: 'integer' },
                price: { type: 'number' },
                total: { type: 'number' },
              },
            },
          },
          totalAmount: { type: 'number' },
          discountAmount: { type: 'number' },
          taxAmount: { type: 'number' },
          shippingAmount: { type: 'number' },
          grandTotal: { type: 'number' },
          currency: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
          paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded', 'partial'] },
          paymentMethod: { type: 'string' },
          shippingAddress: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              country: { type: 'string' },
              postalCode: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          billingAddress: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              country: { type: 'string' },
              postalCode: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          trackingNumber: { type: 'string' },
          note: { type: 'string' },
          userId: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['customerId', 'items', 'shippingAddress'],
        properties: {
          customerId: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity', 'price'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer', minimum: 1 },
                price: { type: 'number', minimum: 0 },
              },
            },
          },
          shippingAddress: {
            type: 'object',
            required: ['name', 'address', 'city', 'country', 'phone'],
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              country: { type: 'string' },
              postalCode: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          billingAddress: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              country: { type: 'string' },
              postalCode: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          discountAmount: { type: 'number', minimum: 0 },
          taxAmount: { type: 'number', minimum: 0 },
          shippingAmount: { type: 'number', minimum: 0 },
          currency: { type: 'string' },
          note: { type: 'string' },
        },
      },
      UpdateOrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
          reason: { type: 'string' },
        },
      },

      // 库存相关
      Inventory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          product: { $ref: '#/components/schemas/Product' },
          warehouseId: { type: 'string' },
          quantity: { type: 'integer' },
          reservedQuantity: { type: 'integer' },
          reorderPoint: { type: 'integer' },
          maxStock: { type: 'integer' },
          location: { type: 'string' },
          batchNumber: { type: 'string' },
          expiryDate: { type: 'string', format: 'date' },
          serialNumbers: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AdjustInventoryRequest: {
        type: 'object',
        required: ['type', 'quantity', 'reason'],
        properties: {
          type: { type: 'string', enum: ['add', 'subtract'] },
          quantity: { type: 'integer', minimum: 1 },
          reason: { type: 'string' },
          reference: { type: 'string' },
        },
      },

      // 财务相关
      Finance: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          transactionId: { type: 'string' },
          type: { type: 'string', enum: ['income', 'expense', 'transfer', 'refund', 'adjustment'] },
          category: { type: 'string' },
          subCategory: { type: 'string' },
          description: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string' },
          exchangeRate: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] },
          paymentMethod: { type: 'string' },
          transactionDate: { type: 'string', format: 'date-time' },
          referenceId: { type: 'string' },
          referenceType: { type: 'string' },
          customerId: { type: 'string' },
          customer: { $ref: '#/components/schemas/Customer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // HR相关
      Employee: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          employeeId: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          department: { type: 'string' },
          position: { type: 'string' },
          managerId: { type: 'string' },
          manager: { $ref: '#/components/schemas/Employee' },
          hireDate: { type: 'string', format: 'date' },
          birthDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['active', 'on_leave', 'terminated', 'probation'] },
          salary: { type: 'number' },
          address: { type: 'string' },
          emergencyContact: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relationship: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          skills: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    };
  }

  /**
   * 获取响应定义
   */
  private getResponses(): Record<string, any> {
    return {
      Success: {
        description: '操作成功',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse',
            },
          },
        },
      },
      Paginated: {
        description: '分页数据',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PaginatedResponse',
            },
          },
        },
      },
      BadRequest: {
        description: '请求参数错误',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      Unauthorized: {
        description: '未认证',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      Forbidden: {
        description: '无权限',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      NotFound: {
        description: '资源不存在',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      Conflict: {
        description: '资源冲突',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      InternalError: {
        description: '服务器内部错误',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    };
  }

  /**
   * 获取参数定义
   */
  private getParameters(): Record<string, any> {
    return {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: '资源ID',
      },
      PageParam: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: '页码',
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        description: '每页数量',
      },
      SearchParam: {
        name: 'search',
        in: 'query',
        schema: { type: 'string' },
        description: '搜索关键词',
      },
      SortByParam: {
        name: 'sortBy',
        in: 'query',
        schema: { type: 'string' },
        description: '排序字段',
      },
      SortOrderParam: {
        name: 'sortOrder',
        in: 'query',
        schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        description: '排序方向',
      },
    };
  }

  /**
   * 获取路径定义
   */
  private getPaths(): Record<string, any> {
    return {
      // ========== 认证相关 ==========
      '/auth/login': {
        post: {
          tags: ['认证'],
          summary: '用户登录',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: { description: '登录成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/auth/register': {
        post: {
          tags: ['认证'],
          summary: '用户注册',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserRequest' },
              },
            },
          },
          responses: {
            200: { description: '注册成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/Conflict' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['认证'],
          summary: '刷新令牌',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: '刷新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['认证'],
          summary: '登出',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: '登出成功' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // ========== 用户相关 ==========
      '/users': {
        get: {
          tags: ['用户'],
          summary: '获取用户列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
        post: {
          tags: ['用户'],
          summary: '创建用户',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserRequest' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['用户'],
          summary: '获取用户详情',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['用户'],
          summary: '更新用户',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUserRequest' },
              },
            },
          },
          responses: {
            200: { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['用户'],
          summary: '删除用户',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '删除成功' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ========== 客户相关 ==========
      '/customers': {
        get: {
          tags: ['客户'],
          summary: '获取客户列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive', 'lead', 'vip'] } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'email', 'createdAt', 'totalSpent'] } },
            { $ref: '#/components/parameters/SortOrderParam' },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['客户'],
          summary: '创建客户',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCustomerRequest' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/customers/{id}': {
        get: {
          tags: ['客户'],
          summary: '获取客户详情',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['客户'],
          summary: '更新客户',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateCustomerRequest' },
              },
            },
          },
          responses: {
            200: { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['客户'],
          summary: '删除客户',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '删除成功' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ========== 产品相关 ==========
      '/products': {
        get: {
          tags: ['产品'],
          summary: '获取产品列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SearchParam' },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'brand', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive', 'discontinued'] } },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'isFeatured', in: 'query', schema: { type: 'boolean' } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['name', 'price', 'quantity', 'createdAt', 'rating'] } },
            { $ref: '#/components/parameters/SortOrderParam' },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['产品'],
          summary: '创建产品',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateProductRequest' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/products/{id}': {
        get: {
          tags: ['产品'],
          summary: '获取产品详情',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['产品'],
          summary: '更新产品',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateProductRequest' },
              },
            },
          },
          responses: {
            200: { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        delete: {
          tags: ['产品'],
          summary: '删除产品',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '删除成功' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ========== 订单相关 ==========
      '/orders': {
        get: {
          tags: ['订单'],
          summary: '获取订单列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { name: 'customerId', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] } },
            { name: 'paymentStatus', in: 'query', schema: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded', 'partial'] } },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['orderNumber', 'createdAt', 'grandTotal', 'status'] } },
            { $ref: '#/components/parameters/SortOrderParam' },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['订单'],
          summary: '创建订单',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateOrderRequest' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/orders/{id}': {
        get: {
          tags: ['订单'],
          summary: '获取订单详情',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          responses: {
            200: { description: '成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
        put: {
          tags: ['订单'],
          summary: '更新订单',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateOrderRequest' },
              },
            },
          },
          responses: {
            200: { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },
      '/orders/{id}/status': {
        patch: {
          tags: ['订单'],
          summary: '更新订单状态',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateOrderStatusRequest' },
              },
            },
          },
          responses: {
            200: { description: '更新成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ========== 库存相关 ==========
      '/inventory': {
        get: {
          tags: ['库存'],
          summary: '获取库存列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { name: 'productId', in: 'query', schema: { type: 'string' } },
            { name: 'warehouseId', in: 'query', schema: { type: 'string' } },
            { name: 'lowStock', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },
      '/inventory/{id}/adjust': {
        post: {
          tags: ['库存'],
          summary: '调整库存',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AdjustInventoryRequest' },
              },
            },
          },
          responses: {
            200: { description: '调整成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Inventory' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            404: { $ref: '#/components/responses/NotFound' },
          },
        },
      },

      // ========== 财务相关 ==========
      '/finance': {
        get: {
          tags: ['财务'],
          summary: '获取财务列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense', 'transfer', 'refund', 'adjustment'] } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'customerId', in: 'query', schema: { type: 'string' } },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['财务'],
          summary: '创建财务记录',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Finance' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Finance' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // ========== HR相关 ==========
      '/hr/employees': {
        get: {
          tags: ['HR'],
          summary: '获取员工列表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { name: 'department', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'on_leave', 'terminated', 'probation'] } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { $ref: '#/components/responses/Paginated' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
        post: {
          tags: ['HR'],
          summary: '创建员工',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Employee' },
              },
            },
          },
          responses: {
            200: { description: '创建成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/Employee' } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // ========== 报表相关 ==========
      '/reports/sales': {
        get: {
          tags: ['报表'],
          summary: '获取销售报表',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'startDate', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
            { name: 'groupBy', in: 'query', schema: { type: 'string', enum: ['day', 'week', 'month', 'quarter', 'year'] } },
          ],
          responses: {
            200: { description: '报表数据' },
            401: { $ref: '#/components/responses/Unauthorized' },
          },
        },
      },

      // ========== 系统相关 ==========
      '/health': {
        get: {
          tags: ['系统'],
          summary: '健康检查',
          responses: {
            200: { description: '系统健康' },
          },
        },
      },
      '/health/ready': {
        get: {
          tags: ['系统'],
          summary: '就绪检查',
          responses: {
            200: { description: '系统就绪' },
            503: { description: '系统未就绪' },
          },
        },
      },
    };
  }

  /**
   * 设置Swagger UI
   */
  setupSwaggerUI(app: Express, path: string = '/api-docs'): void {
    if (!this.config.enabled) {
      console.log('⚠️ Swagger文档已禁用');
      return;
    }

    const options = this.getSwaggerOptions();
    const specs = swaggerJsdoc(options);

    app.use(path, swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #409EFF }
        .swagger-ui .info .title small { font-size: 14px }
      `,
      customSiteTitle: 'Bai\'s ERP System API Documentation',
    }));

    // 提供JSON格式的文档
    app.get(`${path}.json`, (req, res) => {
      res.json(specs);
    });

    console.log(`📚 Swagger文档已启动: ${path}`);
  }

  /**
   * 获取Swagger规格
   */
  getSpecs(): any {
    const options = this.getSwaggerOptions();
    return swaggerJsdoc(options);
  }
}

/**
 * 创建Swagger配置管理器（工厂函数）
 */
export function createSwaggerConfig(config?: Partial<SwaggerConfig>): SwaggerConfigManager {
  return new SwaggerConfigManager(config);
}

/**
 * 默认Swagger配置管理器实例
 */
export const defaultSwaggerConfig = new SwaggerConfigManager();

export default SwaggerConfigManager;