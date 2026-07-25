/**
 * 迁移管理器
 * 统一管理所有数据库迁移
 * @module migrations/index
 */

import { Db, MongoClient } from 'mongodb';
import { InitCollectionsMigration } from './001_init_collections';
import { AddIndexesMigration } from './002_add_indexes';
import { AddDefaultDataMigration } from './003_add_default_data';

/**
 * 迁移记录接口
 */
export interface MigrationRecord {
  version: string;
  name: string;
  executedAt: Date;
  duration: number;
  status: 'success' | 'failed';
  error?: string;
}

/**
 * 迁移管理器类
 */
export class MigrationManager {
  private static instance: MigrationManager;
  private migrations: Array<{
    version: string;
    name: string;
    up: (db: Db) => Promise<void>;
    down: (db: Db) => Promise<void>;
  }> = [];

  private constructor() {
    this.registerMigrations();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  /**
   * 注册所有迁移
   */
  private registerMigrations(): void {
    this.migrations = [
      {
        version: '001',
        name: 'init_collections',
        up: InitCollectionsMigration.getInstance().up.bind(InitCollectionsMigration.getInstance()),
        down: InitCollectionsMigration.getInstance().down.bind(InitCollectionsMigration.getInstance()),
      },
      {
        version: '002',
        name: 'add_indexes',
        up: AddIndexesMigration.getInstance().up.bind(AddIndexesMigration.getInstance()),
        down: AddIndexesMigration.getInstance().down.bind(AddIndexesMigration.getInstance()),
      },
      {
        version: '003',
        name: 'add_default_data',
        up: AddDefaultDataMigration.getInstance().up.bind(AddDefaultDataMigration.getInstance()),
        down: AddDefaultDataMigration.getInstance().down.bind(AddDefaultDataMigration.getInstance()),
      },
    ];
  }

  /**
   * 获取所有迁移
   */
  getMigrations(): Array<{ version: string; name: string }> {
    return this.migrations.map((m) => ({ version: m.version, name: m.name }));
  }

  /**
   * 获取迁移历史
   */
  async getMigrationHistory(db: Db): Promise<MigrationRecord[]> {
    try {
      const collection = db.collection('_migrations');
      return await collection.find({}).sort({ executedAt: -1 }).toArray() as MigrationRecord[];
    } catch (error) {
      // 如果集合不存在，返回空数组
      return [];
    }
  }

  /**
   * 记录迁移执行结果
   */
  private async recordMigration(
    db: Db,
    version: string,
    name: string,
    duration: number,
    status: 'success' | 'failed',
    error?: string
  ): Promise<void> {
    try {
      const collection = db.collection('_migrations');
      await collection.insertOne({
        version,
        name,
        executedAt: new Date(),
        duration,
        status,
        error,
      });
    } catch (error) {
      console.error('[MigrationManager] 记录迁移失败:', error);
    }
  }

  /**
   * 检查迁移是否已执行
   */
  private async isMigrationExecuted(db: Db, version: string): Promise<boolean> {
    try {
      const collection = db.collection('_migrations');
      const record = await collection.findOne({ version });
      return !!record;
    } catch (error) {
      return false;
    }
  }

  /**
   * 执行所有未执行的迁移
   */
  async migrate(db: Db): Promise<void> {
    console.log('[MigrationManager] 开始执行迁移...');

    for (const migration of this.migrations) {
      const executed = await this.isMigrationExecuted(db, migration.version);
      if (executed) {
        console.log(`[MigrationManager] 迁移已执行: ${migration.version} - ${migration.name}`);
        continue;
      }

      console.log(`[MigrationManager] 执行迁移: ${migration.version} - ${migration.name}`);
      const startTime = Date.now();

      try {
        await migration.up(db);
        const duration = Date.now() - startTime;
        await this.recordMigration(db, migration.version, migration.name, duration, 'success');
        console.log(`[MigrationManager] 迁移完成: ${migration.version} - ${migration.name} (${duration}ms)`);
      } catch (error: any) {
        const duration = Date.now() - startTime;
        await this.recordMigration(db, migration.version, migration.name, duration, 'failed', error.message);
        console.error(`[MigrationManager] 迁移失败: ${migration.version} - ${migration.name}`, error);
        throw error;
      }
    }

    console.log('[MigrationManager] 所有迁移执行完成');
  }

  /**
   * 回滚到指定版本
   */
  async rollback(db: Db, targetVersion?: string): Promise<void> {
    console.log('[MigrationManager] 开始回滚...');

    const history = await this.getMigrationHistory(db);
    const executedVersions = history.map((h) => h.version).sort();

    // 确定回滚范围
    let versionsToRollback = executedVersions;
    if (targetVersion) {
      const index = executedVersions.indexOf(targetVersion);
      if (index === -1) {
        throw new Error(`目标版本 ${targetVersion} 未找到`);
      }
      versionsToRollback = executedVersions.slice(index + 1);
    }

    // 按相反顺序回滚
    for (const version of versionsToRollback.reverse()) {
      const migration = this.migrations.find((m) => m.version === version);
      if (!migration) {
        console.warn(`[MigrationManager] 迁移定义未找到: ${version}`);
        continue;
      }

      console.log(`[MigrationManager] 回滚迁移: ${version} - ${migration.name}`);
      try {
        await migration.down(db);
        // 删除迁移记录
        const collection = db.collection('_migrations');
        await collection.deleteOne({ version });
        console.log(`[MigrationManager] 回滚完成: ${version} - ${migration.name}`);
      } catch (error: any) {
        console.error(`[MigrationManager] 回滚失败: ${version} - ${migration.name}`, error);
        throw error;
      }
    }

    console.log('[MigrationManager] 回滚完成');
  }

  /**
   * 重置数据库
   */
  async reset(db: Db): Promise<void> {
    console.log('[MigrationManager] 开始重置数据库...');

    // 删除所有集合
    const collections = await db.listCollections().toArray();
    for (const coll of collections) {
      if (!coll.name.startsWith('_')) {
        await db.dropCollection(coll.name);
        console.log(`[MigrationManager] 删除集合: ${coll.name}`);
      }
    }

    // 删除迁移记录
    await db.collection('_migrations').deleteMany({});

    console.log('[MigrationManager] 重置完成');
  }

  /**
   * 获取迁移状态
   */
  async getStatus(db: Db): Promise<{
    total: number;
    executed: number;
    pending: number;
    migrations: Array<{
      version: string;
      name: string;
      status: 'executed' | 'pending' | 'failed';
      executedAt?: Date;
    }>;
  }> {
    const history = await this.getMigrationHistory(db);
    const executedVersions = history.map((h) => h.version);

    const migrations = this.migrations.map((m) => {
      const record = history.find((h) => h.version === m.version);
      return {
        version: m.version,
        name: m.name,
        status: record ? (record.status === 'success' ? 'executed' : 'failed') : 'pending',
        executedAt: record?.executedAt,
      };
    });

    return {
      total: this.migrations.length,
      executed: migrations.filter((m) => m.status === 'executed').length,
      pending: migrations.filter((m) => m.status === 'pending').length,
      migrations,
    };
  }
}

/**
 * 执行所有迁移（便捷函数）
 */
export async function migrate(db: Db): Promise<void> {
  const manager = MigrationManager.getInstance();
  await manager.migrate(db);
}

/**
 * 回滚迁移（便捷函数）
 */
export async function rollback(db: Db, targetVersion?: string): Promise<void> {
  const manager = MigrationManager.getInstance();
  await manager.rollback(db, targetVersion);
}

/**
 * 重置数据库（便捷函数）
 */
export async function reset(db: Db): Promise<void> {
  const manager = MigrationManager.getInstance();
  await manager.reset(db);
}

/**
 * 获取迁移状态（便捷函数）
 */
export async function getStatus(db: Db): Promise<any> {
  const manager = MigrationManager.getInstance();
  return manager.getStatus(db);
}

export default MigrationManager;