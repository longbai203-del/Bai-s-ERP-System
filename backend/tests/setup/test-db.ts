/**
 * 测试数据库设置
 * 提供测试用的数据库连接和清理
 * @module tests/setup/test-db
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * 测试数据库配置
 */
export interface TestDbConfig {
  /** 是否使用内存数据库 */
  useMemoryDb?: boolean;
  /** 连接字符串 */
  connectionString?: string;
  /** 数据库名称 */
  databaseName?: string;
  /** 是否自动清理 */
  autoCleanup?: boolean;
}

/**
 * 测试数据库管理器
 */
export class TestDatabaseManager {
  private static instance: TestDatabaseManager;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private mongoServer: MongoMemoryServer | null = null;
  private config: TestDbConfig;
  private initialized: boolean = false;

  private constructor(config: TestDbConfig = {}) {
    this.config = {
      useMemoryDb: true,
      autoCleanup: true,
      databaseName: 'test_db',
      ...config,
    };
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: TestDbConfig): TestDatabaseManager {
    if (!TestDatabaseManager.instance) {
      TestDatabaseManager.instance = new TestDatabaseManager(config);
    }
    return TestDatabaseManager.instance;
  }

  /**
   * 初始化测试数据库
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      let connectionString: string;

      if (this.config.useMemoryDb) {
        // 使用内存数据库
        this.mongoServer = await MongoMemoryServer.create();
        connectionString = this.mongoServer.getUri();
        console.log('🧪 内存MongoDB已启动');
      } else {
        // 使用真实数据库
        connectionString = this.config.connectionString || process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017';
        console.log('🧪 使用真实MongoDB: ' + connectionString);
      }

      this.client = new MongoClient(connectionString, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });

      await this.client.connect();
      this.db = this.client.db(this.config.databaseName);

      this.initialized = true;
      console.log('✅ 测试数据库连接成功');

      // 如果启用了自动清理，注册清理钩子
      if (this.config.autoCleanup) {
        process.on('exit', () => {
          this.cleanup();
        });
      }
    } catch (error) {
      console.error('❌ 测试数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取数据库实例
   */
  getDb(): Db {
    if (!this.db) {
      throw new Error('数据库未初始化，请先调用 initialize()');
    }
    return this.db;
  }

  /**
   * 获取集合
   */
  getCollection(name: string): Collection {
    const db = this.getDb();
    return db.collection(name);
  }

  /**
   * 清空所有集合
   */
  async clearCollections(): Promise<void> {
    if (!this.db) {
      return;
    }

    const collections = await this.db.listCollections().toArray();
    for (const coll of collections) {
      if (!coll.name.startsWith('system.')) {
        await this.db.collection(coll.name).deleteMany({});
      }
    }
    console.log('🧹 测试数据库已清空');
  }

  /**
   * 清空指定集合
   */
  async clearCollection(name: string): Promise<void> {
    if (!this.db) {
      return;
    }
    await this.db.collection(name).deleteMany({});
    console.log(`🧹 集合已清空: ${name}`);
  }

  /**
   * 创建索引
   */
  async createIndexes(): Promise<void> {
    if (!this.db) {
      return;
    }

    // 用户集合索引
    await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await this.db.collection('users').createIndex({ username: 1 }, { unique: true });
    await this.db.collection('users').createIndex({ isActive: 1 });

    // 客户集合索引
    await this.db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await this.db.collection('customers').createIndex({ phone: 1 });
    await this.db.collection('customers').createIndex({ status: 1 });
    await this.db.collection('customers').createIndex({ tags: 1 });

    // 产品集合索引
    await this.db.collection('products').createIndex({ sku: 1 }, { unique: true });
    await this.db.collection('products').createIndex({ category: 1 });
    await this.db.collection('products').createIndex({ status: 1 });
    await this.db.collection('products').createIndex({ price: 1 });

    // 订单集合索引
    await this.db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await this.db.collection('orders').createIndex({ customerId: 1 });
    await this.db.collection('orders').createIndex({ status: 1 });
    await this.db.collection('orders').createIndex({ createdAt: -1 });

    // 库存集合索引
    await this.db.collection('inventories').createIndex({ productId: 1, warehouseId: 1 }, { unique: true });
    await this.db.collection('inventories').createIndex({ warehouseId: 1 });
    await this.db.collection('inventories').createIndex({ quantity: 1 });

    // 财务集合索引
    await this.db.collection('finances').createIndex({ transactionId: 1 }, { unique: true });
    await this.db.collection('finances').createIndex({ type: 1 });
    await this.db.collection('finances').createIndex({ status: 1 });
    await this.db.collection('finances').createIndex({ createdAt: -1 });

    console.log('📊 测试数据库索引已创建');
  }

  /**
   * 获取测试数据
   */
  async loadTestData(data: Record<string, any[]>): Promise<void> {
    if (!this.db) {
      return;
    }

    for (const [collectionName, documents] of Object.entries(data)) {
      if (documents && documents.length > 0) {
        await this.db.collection(collectionName).insertMany(documents);
        console.log(`📦 加载测试数据: ${collectionName} (${documents.length}条)`);
      }
    }
  }

  /**
   * 获取连接状态
   */
  getStatus(): {
    initialized: boolean;
    connected: boolean;
    dbName: string | null;
    useMemoryDb: boolean;
  } {
    return {
      initialized: this.initialized,
      connected: this.client !== null && this.client.isConnected(),
      dbName: this.db?.databaseName || null,
      useMemoryDb: this.config.useMemoryDb || false,
    };
  }

  /**
   * 清理测试数据库
   */
  async cleanup(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        console.log('🔒 测试数据库连接已关闭');
      } catch (error) {
        console.error('关闭数据库连接失败:', error);
      }
      this.client = null;
      this.db = null;
    }

    if (this.mongoServer) {
      try {
        await this.mongoServer.stop();
        console.log('🧹 内存MongoDB已停止');
      } catch (error) {
        console.error('停止内存MongoDB失败:', error);
      }
      this.mongoServer = null;
    }

    this.initialized = false;
  }

  /**
   * 重置数据库（清空 + 重建索引）
   */
  async reset(): Promise<void> {
    await this.clearCollections();
    await this.createIndexes();
    console.log('🔄 测试数据库已重置');
  }

  /**
   * 事务测试辅助
   */
  async withTransaction<T>(
    callback: (db: Db) => Promise<T>,
    session?: any
  ): Promise<T> {
    const client = this.client;
    if (!client) {
      throw new Error('数据库未连接');
    }

    const sessionObj = session || client.startSession();
    let result: T;

    try {
      await sessionObj.withTransaction(async () => {
        result = await callback(this.getDb());
      });
      return result!;
    } finally {
      if (!session) {
        await sessionObj.endSession();
      }
    }
  }
}

/**
 * 创建测试数据库管理器
 */
export function createTestDbManager(config?: TestDbConfig): TestDatabaseManager {
  return TestDatabaseManager.getInstance(config);
}

/**
 * 全局测试数据库实例
 */
export const testDb = TestDatabaseManager.getInstance();

/**
 * 测试数据库辅助函数
 */
export const testDbHelpers = {
  /**
   * 初始化测试数据库
   */
  init: async (config?: TestDbConfig): Promise<Db> => {
    const manager = TestDatabaseManager.getInstance(config);
    await manager.initialize();
    return manager.getDb();
  },

  /**
   * 清空所有集合
   */
  clear: async (): Promise<void> => {
    const manager = TestDatabaseManager.getInstance();
    await manager.clearCollections();
  },

  /**
   * 创建测试数据
   */
  seed: async (data: Record<string, any[]>): Promise<void> => {
    const manager = TestDatabaseManager.getInstance();
    await manager.loadTestData(data);
  },

  /**
   * 重置数据库
   */
  reset: async (): Promise<void> => {
    const manager = TestDatabaseManager.getInstance();
    await manager.reset();
  },

  /**
   * 清理数据库
   */
  cleanup: async (): Promise<void> => {
    const manager = TestDatabaseManager.getInstance();
    await manager.cleanup();
  },
};

export default TestDatabaseManager;