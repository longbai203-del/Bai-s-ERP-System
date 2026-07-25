/**
 * 添加索引迁移
 * 添加性能优化索引
 * @module 002_add_indexes
 */

import { Db, Collection } from 'mongodb';

/**
 * 索引定义接口
 */
interface IndexDefinition {
  collection: string;
  keys: Record<string, number | string>;
  options?: {
    name?: string;
    unique?: boolean;
    sparse?: boolean;
    expireAfterSeconds?: number;
    partialFilterExpression?: Record<string, any>;
  };
}

/**
 * 添加索引迁移类
 */
export class AddIndexesMigration {
  private static instance: AddIndexesMigration;
  private indexes: IndexDefinition[] = [];

  private constructor() {
    this.defineIndexes();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): AddIndexesMigration {
    if (!AddIndexesMigration.instance) {
      AddIndexesMigration.instance = new AddIndexesMigration();
    }
    return AddIndexesMigration.instance;
  }

  /**
   * 定义所有索引
   */
  private defineIndexes(): void {
    this.indexes = [
      // 用户集合索引
      {
        collection: 'users',
        keys: { 'isActive': 1, 'isVerified': 1 },
        options: { name: 'idx_active_verified' },
      },
      {
        collection: 'users',
        keys: { 'lastLoginAt': -1 },
        options: { name: 'idx_last_login' },
      },
      {
        collection: 'users',
        keys: { 'createdAt': 1, 'isActive': 1 },
        options: { name: 'idx_created_active' },
      },

      // 客户集合索引
      {
        collection: 'customers',
        keys: { 'status': 1, 'createdAt': -1 },
        options: { name: 'idx_status_created' },
      },
      {
        collection: 'customers',
        keys: { 'totalSpent': -1 },
        options: { name: 'idx_total_spent' },
      },
      {
        collection: 'customers',
        keys: { 'tags': 1 },
        options: { name: 'idx_tags' },
      },
      {
        collection: 'customers',
        keys: { 'lastOrderAt': -1 },
        options: { name: 'idx_last_order' },
      },

      // 产品集合索引
      {
        collection: 'products',
        keys: { 'category': 1, 'status': 1 },
        options: { name: 'idx_category_status' },
      },
      {
        collection: 'products',
        keys: { 'price': 1, 'status': 1 },
        options: { name: 'idx_price_status' },
      },
      {
        collection: 'products',
        keys: { 'isFeatured': 1, 'status': 1 },
        options: { name: 'idx_featured_status' },
      },
      {
        collection: 'products',
        keys: { 'quantity': 1, 'reorderLevel': 1 },
        options: { name: 'idx_quantity_reorder' },
      },

      // 订单集合索引
      {
        collection: 'orders',
        keys: { 'customerId': 1, 'createdAt': -1 },
        options: { name: 'idx_customer_created' },
      },
      {
        collection: 'orders',
        keys: { 'status': 1, 'createdAt': -1 },
        options: { name: 'idx_status_created' },
      },
      {
        collection: 'orders',
        keys: { 'paymentStatus': 1, 'status': 1 },
        options: { name: 'idx_payment_status' },
      },
      {
        collection: 'orders',
        keys: { 'createdAt': 1, 'status': 1 },
        options: { name: 'idx_created_status' },
      },
      {
        collection: 'orders',
        keys: { 'grandTotal': -1 },
        options: { name: 'idx_grand_total' },
      },

      // 库存集合索引
      {
        collection: 'inventories',
        keys: { 'quantity': 1, 'reorderPoint': 1 },
        options: { name: 'idx_quantity_reorder' },
      },
      {
        collection: 'inventories',
        keys: { 'expiryDate': 1 },
        options: { name: 'idx_expiry_date' },
      },
      {
        collection: 'inventories',
        keys: { 'warehouseId': 1, 'location': 1 },
        options: { name: 'idx_warehouse_location' },
      },

      // 财务集合索引
      {
        collection: 'finances',
        keys: { 'type': 1, 'createdAt': -1 },
        options: { name: 'idx_type_created' },
      },
      {
        collection: 'finances',
        keys: { 'customerId': 1, 'createdAt': -1 },
        options: { name: 'idx_customer_created' },
      },
      {
        collection: 'finances',
        keys: { 'status': 1, 'createdAt': -1 },
        options: { name: 'idx_status_created' },
      },
      {
        collection: 'finances',
        keys: { 'category': 1 },
        options: { name: 'idx_category' },
      },

      // 员工集合索引
      {
        collection: 'employees',
        keys: { 'department': 1, 'status': 1 },
        options: { name: 'idx_dept_status' },
      },
      {
        collection: 'employees',
        keys: { 'position': 1 },
        options: { name: 'idx_position' },
      },
      {
        collection: 'employees',
        keys: { 'hireDate': -1 },
        options: { name: 'idx_hire_date' },
      },
      {
        collection: 'employees',
        keys: { 'managerId': 1, 'status': 1 },
        options: { name: 'idx_manager_status' },
      },

      // 审计日志索引
      {
        collection: 'audit_logs',
        keys: { 'userId': 1, 'timestamp': -1 },
        options: { name: 'idx_user_timestamp' },
      },
      {
        collection: 'audit_logs',
        keys: { 'module': 1, 'timestamp': -1 },
        options: { name: 'idx_module_timestamp' },
      },
      {
        collection: 'audit_logs',
        keys: { 'level': 1, 'timestamp': -1 },
        options: { name: 'idx_level_timestamp' },
      },
      {
        collection: 'audit_logs',
        keys: { 'timestamp': -1 },
        options: { name: 'idx_timestamp' },
      },

      // 复合索引优化
      {
        collection: 'orders',
        keys: { 'customerId': 1, 'status': 1, 'createdAt': -1 },
        options: { name: 'idx_customer_status_created' },
      },
      {
        collection: 'inventories',
        keys: { 'productId': 1, 'warehouseId': 1, 'quantity': 1 },
        options: { name: 'idx_product_warehouse_quantity' },
      },
    ];
  }

  /**
   * 获取所有索引定义
   */
  getIndexDefinitions(): IndexDefinition[] {
    return this.indexes;
  }

  /**
   * 执行迁移
   */
  async up(db: Db): Promise<void> {
    console.log('[Migration 002] 开始添加索引...');

    for (const indexDef of this.indexes) {
      try {
        const collection: Collection = db.collection(indexDef.collection);

        // 检查索引是否已存在
        const exists = await this.indexExists(collection, indexDef);
        if (!exists) {
          await collection.createIndex(indexDef.keys, {
            name: indexDef.options?.name,
            unique: indexDef.options?.unique,
            sparse: indexDef.options?.sparse,
            expireAfterSeconds: indexDef.options?.expireAfterSeconds,
            partialFilterExpression: indexDef.options?.partialFilterExpression,
            background: true,
          });
          console.log(`[Migration 002] 创建索引: ${indexDef.collection}.${indexDef.options?.name}`);
        } else {
          console.log(`[Migration 002] 索引已存在: ${indexDef.collection}.${indexDef.options?.name}`);
        }
      } catch (error: any) {
        console.error(`[Migration 002] 创建索引失败: ${indexDef.collection}.${indexDef.options?.name} - ${error.message}`);
      }
    }

    console.log('[Migration 002] 索引添加完成');
  }

  /**
   * 检查索引是否存在
   */
  private async indexExists(collection: Collection, indexDef: IndexDefinition): Promise<boolean> {
    try {
      const indexes = await collection.indexes();
      const indexName = indexDef.options?.name || Object.keys(indexDef.keys).join('_');
      return indexes.some((idx) => idx.name === indexName);
    } catch (error) {
      return false;
    }
  }

  /**
   * 回滚迁移
   */
  async down(db: Db): Promise<void> {
    console.log('[Migration 002] 开始回滚索引...');

    for (const indexDef of this.indexes) {
      try {
        const collection: Collection = db.collection(indexDef.collection);
        const indexName = indexDef.options?.name || Object.keys(indexDef.keys).join('_');

        // 检查索引是否存在
        const exists = await this.indexExists(collection, indexDef);
        if (exists) {
          await collection.dropIndex(indexName);
          console.log(`[Migration 002] 删除索引: ${indexDef.collection}.${indexName}`);
        }
      } catch (error: any) {
        console.error(`[Migration 002] 删除索引失败: ${indexDef.collection} - ${error.message}`);
      }
    }

    console.log('[Migration 002] 索引回滚完成');
  }

  /**
   * 获取版本号
   */
  getVersion(): string {
    return '002';
  }

  /**
   * 获取迁移名称
   */
  getName(): string {
    return 'add_indexes';
  }
}

/**
 * 执行向上迁移
 */
export async function up(db: Db): Promise<void> {
  const migration = AddIndexesMigration.getInstance();
  await migration.up(db);
}

/**
 * 执行向下迁移
 */
export async function down(db: Db): Promise<void> {
  const migration = AddIndexesMigration.getInstance();
  await migration.down(db);
}

export default AddIndexesMigration;