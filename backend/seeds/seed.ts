/**
 * @file seeds/seed.ts
 * 数据库种子数据 - 初始化基础数据
 */

import { dataSource } from '../Config/database';
import { logger } from '../Config/winston.config';

async function seedDatabase() {
  try {
    await dataSource.initialize();
    logger.info('数据库连接成功，开始种子数据插入...');

    // 这里可以插入初始数据
    // 例如: 系统设置、默认角色、默认权限等

    logger.info('种子数据插入完成');
    await dataSource.destroy();
  } catch (error) {
    logger.error('种子数据插入失败:', error);
    process.exit(1);
  }
}

// 执行种子数据
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;