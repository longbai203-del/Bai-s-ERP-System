/**
 * 初始化集合迁移
 * 创建所有必要的数据库集合和索引
 * @module 001_init_collections
 */

import { Db, Collection, IndexSpecification } from 'mongodb';

/**
 * 集合定义接口
 */
interface CollectionDefinition {
  name: string;
  options?: {
    capped?: boolean;
    size?: number;
    max?: number;
    validator?: object;
    validationLevel?: 'off' | 'strict' | 'moderate';
    validationAction?: 'error' | 'warn';
  };
  indexes?: IndexSpecification[];
}

/**
 * 初始化集合迁移类
 */
export class InitCollectionsMigration {
  private static instance: InitCollectionsMigration;
  private collections: CollectionDefinition[] = [];

  private constructor() {
    this.defineCollections();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): InitCollectionsMigration {
    if (!InitCollectionsMigration.instance) {
      InitCollectionsMigration.instance = new InitCollectionsMigration();
    }
    return InitCollectionsMigration.instance;
  }

  /**
   * 定义所有集合
   */
  private defineCollections(): void {
    this.collections = [
      // 用户集合
      {
        name: 'users',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['email', 'username', 'passwordHash', 'createdAt'],
              properties: {
                email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
                username: { bsonType: 'string', minLength: 3, maxLength: 50 },
                passwordHash: { bsonType: 'string' },
                firstName: { bsonType: 'string' },
                lastName: { bsonType: 'string' },
                roles: { bsonType: 'array', items: { bsonType: 'string' } },
                isActive: { bsonType: 'bool' },
                isVerified: { bsonType: 'bool' },
                lastLoginAt: { bsonType: 'date' },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { email: 1 }, unique: true },
          { key: { username: 1 }, unique: true },
          { key: { isActive: 1 } },
          { key: { createdAt: -1 } },
          { key: { roles: 1 } },
        ],
      },

      // 客户集合
      {
        name: 'customers',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name', 'email', 'phone', 'createdAt'],
              properties: {
                name: { bsonType: 'string', minLength: 1, maxLength: 200 },
                email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
                phone: { bsonType: 'string' },
                address: { bsonType: 'string' },
                city: { bsonType: 'string' },
                country: { bsonType: 'string' },
                postalCode: { bsonType: 'string' },
                taxId: { bsonType: 'string' },
                industry: { bsonType: 'string' },
                status: { bsonType: 'string', enum: ['active', 'inactive', 'lead', 'vip'] },
                tags: { bsonType: 'array', items: { bsonType: 'string' } },
                totalOrders: { bsonType: 'int', minimum: 0 },
                totalSpent: { bsonType: 'double', minimum: 0 },
                lastOrderAt: { bsonType: 'date' },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { email: 1 }, unique: true },
          { key: { phone: 1 } },
          { key: { status: 1 } },
          { key: { tags: 1 } },
          { key: { totalSpent: -1 } },
          { key: { createdAt: -1 } },
          { key: { name: 'text' } },
        ],
      },

      // 产品集合
      {
        name: 'products',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name', 'sku', 'price', 'createdAt'],
              properties: {
                name: { bsonType: 'string', minLength: 1, maxLength: 200 },
                sku: { bsonType: 'string', minLength: 1, maxLength: 50 },
                description: { bsonType: 'string' },
                category: { bsonType: 'string' },
                brand: { bsonType: 'string' },
                price: { bsonType: 'double', minimum: 0 },
                cost: { bsonType: 'double', minimum: 0 },
                quantity: { bsonType: 'int', minimum: 0 },
                reorderLevel: { bsonType: 'int', minimum: 0 },
                weight: { bsonType: 'double', minimum: 0 },
                dimensions: {
                  bsonType: 'object',
                  properties: {
                    length: { bsonType: 'double' },
                    width: { bsonType: 'double' },
                    height: { bsonType: 'double' },
                    unit: { bsonType: 'string' },
                  },
                },
                images: { bsonType: 'array', items: { bsonType: 'string' } },
                status: { bsonType: 'string', enum: ['active', 'inactive', 'discontinued'] },
                isFeatured: { bsonType: 'bool' },
                tags: { bsonType: 'array', items: { bsonType: 'string' } },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { sku: 1 }, unique: true },
          { key: { category: 1 } },
          { key: { brand: 1 } },
          { key: { status: 1 } },
          { key: { isFeatured: 1 } },
          { key: { price: 1 } },
          { key: { quantity: 1 } },
          { key: { createdAt: -1 } },
          { key: { name: 'text' } },
        ],
      },

      // 订单集合
      {
        name: 'orders',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['orderNumber', 'customerId', 'items', 'totalAmount', 'status', 'createdAt'],
              properties: {
                orderNumber: { bsonType: 'string', minLength: 1, maxLength: 50 },
                customerId: { bsonType: 'string' },
                items: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'object',
                    required: ['productId', 'name', 'quantity', 'price'],
                    properties: {
                      productId: { bsonType: 'string' },
                      name: { bsonType: 'string' },
                      sku: { bsonType: 'string' },
                      quantity: { bsonType: 'int', minimum: 1 },
                      price: { bsonType: 'double', minimum: 0 },
                      total: { bsonType: 'double' },
                    },
                  },
                },
                totalAmount: { bsonType: 'double', minimum: 0 },
                discountAmount: { bsonType: 'double', minimum: 0 },
                taxAmount: { bsonType: 'double', minimum: 0 },
                shippingAmount: { bsonType: 'double', minimum: 0 },
                grandTotal: { bsonType: 'double', minimum: 0 },
                currency: { bsonType: 'string', minLength: 3, maxLength: 3 },
                status: {
                  bsonType: 'string',
                  enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
                },
                paymentStatus: {
                  bsonType: 'string',
                  enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
                },
                shippingAddress: { bsonType: 'object' },
                billingAddress: { bsonType: 'object' },
                trackingNumber: { bsonType: 'string' },
                note: { bsonType: 'string' },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
                completedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { orderNumber: 1 }, unique: true },
          { key: { customerId: 1 } },
          { key: { status: 1 } },
          { key: { paymentStatus: 1 } },
          { key: { createdAt: -1 } },
          { key: { 'items.productId': 1 } },
          { key: { trackingNumber: 1 } },
          { key: { grandTotal: 1 } },
        ],
      },

      // 库存集合
      {
        name: 'inventories',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['productId', 'quantity', 'warehouseId', 'createdAt'],
              properties: {
                productId: { bsonType: 'string' },
                warehouseId: { bsonType: 'string' },
                quantity: { bsonType: 'int', minimum: 0 },
                reservedQuantity: { bsonType: 'int', minimum: 0 },
                reorderPoint: { bsonType: 'int', minimum: 0 },
                maxStock: { bsonType: 'int', minimum: 0 },
                lastCountedAt: { bsonType: 'date' },
                location: { bsonType: 'string' },
                batchNumber: { bsonType: 'string' },
                expiryDate: { bsonType: 'date' },
                serialNumbers: { bsonType: 'array', items: { bsonType: 'string' } },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { productId: 1, warehouseId: 1 }, unique: true },
          { key: { warehouseId: 1 } },
          { key: { quantity: 1 } },
          { key: { reorderPoint: 1 } },
          { key: { batchNumber: 1 } },
          { key: { expiryDate: 1 } },
          { key: { location: 1 } },
        ],
      },

      // 财务记录集合
      {
        name: 'finances',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['transactionId', 'type', 'amount', 'currency', 'status', 'createdAt'],
              properties: {
                transactionId: { bsonType: 'string' },
                type: { bsonType: 'string', enum: ['income', 'expense', 'transfer', 'refund', 'adjustment'] },
                category: { bsonType: 'string' },
                subCategory: { bsonType: 'string' },
                amount: { bsonType: 'double', minimum: 0 },
                currency: { bsonType: 'string', minLength: 3, maxLength: 3 },
                exchangeRate: { bsonType: 'double', minimum: 0 },
                status: { bsonType: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] },
                description: { bsonType: 'string' },
                referenceId: { bsonType: 'string' },
                referenceType: { bsonType: 'string' },
                customerId: { bsonType: 'string' },
                accountId: { bsonType: 'string' },
                paymentMethod: { bsonType: 'string' },
                transactionDate: { bsonType: 'date' },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { transactionId: 1 }, unique: true },
          { key: { type: 1 } },
          { key: { status: 1 } },
          { key: { customerId: 1 } },
          { key: { referenceId: 1 } },
          { key: { transactionDate: -1 } },
          { key: { createdAt: -1 } },
          { key: { amount: 1 } },
        ],
      },

      // HR员工集合
      {
        name: 'employees',
        options: {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['employeeId', 'firstName', 'lastName', 'email', 'department', 'position', 'createdAt'],
              properties: {
                employeeId: { bsonType: 'string' },
                firstName: { bsonType: 'string' },
                lastName: { bsonType: 'string' },
                email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
                phone: { bsonType: 'string' },
                department: { bsonType: 'string' },
                position: { bsonType: 'string' },
                managerId: { bsonType: 'string' },
                hireDate: { bsonType: 'date' },
                birthDate: { bsonType: 'date' },
                status: { bsonType: 'string', enum: ['active', 'on_leave', 'terminated', 'probation'] },
                salary: { bsonType: 'double', minimum: 0 },
                address: { bsonType: 'string' },
                emergencyContact: { bsonType: 'object' },
                documents: { bsonType: 'array', items: { bsonType: 'string' } },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { employeeId: 1 }, unique: true },
          { key: { email: 1 }, unique: true },
          { key: { department: 1 } },
          { key: { position: 1 } },
          { key: { managerId: 1 } },
          { key: { status: 1 } },
          { key: { hireDate: -1 } },
          { key: { createdAt: -1 } },
        ],
      },

      // 审计日志集合
      {
        name: 'audit_logs',
        options: {
          capped: false,
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['userId', 'action', 'module', 'timestamp'],
              properties: {
                userId: { bsonType: 'string' },
                username: { bsonType: 'string' },
                action: { bsonType: 'string' },
                module: { bsonType: 'string' },
                resourceId: { bsonType: 'string' },
                resourceType: { bsonType: 'string' },
                beforeData: { bsonType: 'object' },
                afterData: { bsonType: 'object' },
                ip: { bsonType: 'string' },
                userAgent: { bsonType: 'string' },
                level: { bsonType: 'string', enum: ['info', 'warn', 'error', 'critical'] },
                timestamp: { bsonType: 'date' },
              },
            },
          },
        },
        indexes: [
          { key: { userId: 1 } },
          { key: { action: 1 } },
          { key: { module: 1 } },
          { key: { timestamp: -1 } },
          { key: { userId: 1, timestamp: -1 } },
          { key: { module: 1, timestamp: -1 } },
        ],
      },
    ];
  }

  /**
   * 获取所有集合定义
   */
  getCollectionDefinitions(): CollectionDefinition[] {
    return this.collections;
  }

  /**
   * 执行迁移
   */
  async up(db: Db): Promise<void> {
    console.log('[Migration 001] 开始初始化集合...');

    for (const collectionDef of this.collections) {
      try {
        // 检查集合是否存在
        const collections = await db.listCollections({ name: collectionDef.name }).toArray();

        if (collections.length === 0) {
          // 创建集合
          await db.createCollection(collectionDef.name, collectionDef.options);
          console.log(`[Migration 001] 创建集合: ${collectionDef.name}`);
        } else {
          // 更新集合配置（仅当存在时）
          console.log(`[Migration 001] 集合已存在: ${collectionDef.name}`);
        }

        // 创建索引
        if (collectionDef.indexes && collectionDef.indexes.length > 0) {
          const collection: Collection = db.collection(collectionDef.name);
          for (const index of collectionDef.indexes) {
            try {
              await collection.createIndex(index.key, {
                unique: index.unique,
                name: index.name,
                background: true,
              });
              console.log(`[Migration 001] 创建索引: ${collectionDef.name} - ${JSON.stringify(index.key)}`);
            } catch (error: any) {
              if (error.code === 85) {
                console.log(`[Migration 001] 索引已存在: ${collectionDef.name}`);
              } else {
                console.error(`[Migration 001] 创建索引失败: ${collectionDef.name} - ${error.message}`);
              }
            }
          }
        }
      } catch (error: any) {
        console.error(`[Migration 001] 处理集合失败: ${collectionDef.name} - ${error.message}`);
        throw error;
      }
    }

    console.log('[Migration 001] 集合初始化完成');
  }

  /**
   * 回滚迁移
   */
  async down(db: Db): Promise<void> {
    console.log('[Migration 001] 开始回滚...');

    for (const collectionDef of this.collections) {
      try {
        await db.dropCollection(collectionDef.name);
        console.log(`[Migration 001] 删除集合: ${collectionDef.name}`);
      } catch (error: any) {
        if (error.code === 26) {
          console.log(`[Migration 001] 集合不存在: ${collectionDef.name}`);
        } else {
          console.error(`[Migration 001] 删除集合失败: ${collectionDef.name} - ${error.message}`);
        }
      }
    }

    console.log('[Migration 001] 回滚完成');
  }

  /**
   * 获取版本号
   */
  getVersion(): string {
    return '001';
  }

  /**
   * 获取迁移名称
   */
  getName(): string {
    return 'init_collections';
  }
}

/**
 * 执行向上迁移
 */
export async function up(db: Db): Promise<void> {
  const migration = InitCollectionsMigration.getInstance();
  await migration.up(db);
}

/**
 * 执行向下迁移
 */
export async function down(db: Db): Promise<void> {
  const migration = InitCollectionsMigration.getInstance();
  await migration.down(db);
}

export default InitCollectionsMigration;