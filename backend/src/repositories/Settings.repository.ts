/**
 * @file Repositories/Settings.repository.ts
 * 系统设置仓储 - 配置数据访问层
 */

import { Repository, DataSource, Like, In, FindOptionsWhere } from 'typeorm';
import { Settings } from '../Models/Settings.model';
import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { logger } from '../Config/winston.config';
import dataSource from '../Config/database';

export interface SettingsFilters {
  group?: string;
  search?: string;
}

export class SettingsRepository extends BaseRepository<Settings> {
  private settingsRepository: Repository<Settings>;

  constructor(dataSource: DataSource) {
    super(dataSource, Settings);
    this.settingsRepository = dataSource.getRepository(Settings);
  }

  /**
   * 根据键名查找设置
   */
  async findByKey(key: string): Promise<Settings | null> {
    try {
      return await this.settingsRepository.findOne({
        where: { key },
      });
    } catch (error) {
      logger.error('[SettingsRepository] 根据键名查找失败', { key, error });
      throw error;
    }
  }

  /**
   * 根据分组获取设置列表
   */
  async findByGroup(group: string): Promise<Settings[]> {
    try {
      return await this.settingsRepository.find({
        where: { group },
        order: { key: 'ASC' },
      });
    } catch (error) {
      logger.error('[SettingsRepository] 根据分组查找失败', { group, error });
      throw error;
    }
  }

  /**
   * 分页查询设置
   */
  async searchSettings(
    filters: SettingsFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Settings>> {
    try {
      const where: FindOptionsWhere<Settings> = {};

      if (filters.group) {
        where.group = filters.group;
      }
      if (filters.search) {
        where.key = Like(`%${filters.search}%`);
        // 或者使用 OR 条件搜索描述
      }

      return await this.findWithPagination(pagination, where);
    } catch (error) {
      logger.error('[SettingsRepository] 搜索设置失败', { filters, error });
      throw error;
    }
  }

  /**
   * 创建或更新设置
   */
  async upsert(key: string, value: string, group?: string, description?: string): Promise<Settings> {
    try {
      const existing = await this.findByKey(key);

      if (existing) {
        // 更新
        await this.settingsRepository.update(
          { id: existing.id },
          {
            value,
            group: group || existing.group,
            description: description || existing.description,
            updatedAt: new Date(),
          }
        );
        return await this.findByKey(key) as Settings;
      } else {
        // 创建
        const newSetting = this.settingsRepository.create({
          key,
          value,
          group: group || 'general',
          description,
        });
        return await this.settingsRepository.save(newSetting);
      }
    } catch (error) {
      logger.error('[SettingsRepository] 创建或更新设置失败', { key, error });
      throw error;
    }
  }

  /**
   * 批量更新设置
   */
  async batchUpsert(
    settings: Array<{ key: string; value: string; group?: string; description?: string }>
  ): Promise<Settings[]> {
    try {
      const results: Settings[] = [];

      for (const setting of settings) {
        const result = await this.upsert(setting.key, setting.value, setting.group, setting.description);
        results.push(result);
      }

      return results;
    } catch (error) {
      logger.error('[SettingsRepository] 批量更新设置失败', { error });
      throw error;
    }
  }

  /**
   * 获取所有设置分组
   */
  async getGroups(): Promise<string[]> {
    try {
      const results = await this.settingsRepository
        .createQueryBuilder('settings')
        .select('DISTINCT group')
        .where('group IS NOT NULL')
        .andWhere('group != ""')
        .orderBy('group', 'ASC')
        .getRawMany();

      return results.map(r => r.group).filter(Boolean);
    } catch (error) {
      logger.error('[SettingsRepository] 获取分组列表失败', { error });
      throw error;
    }
  }

  /**
   * 获取设置数量统计
   */
  async getSettingsStats(): Promise<{
    total: number;
    groups: number;
    byGroup: Array<{ group: string; count: number }>;
  }> {
    try {
      const total = await this.settingsRepository.count();

      const groupStats = await this.settingsRepository
        .createQueryBuilder('settings')
        .select(['settings.group as group', 'COUNT(*) as count'])
        .where('settings.group IS NOT NULL')
        .groupBy('settings.group')
        .getRawMany();

      return {
        total,
        groups: groupStats.length,
        byGroup: groupStats.map(g => ({
          group: g.group || 'uncategorized',
          count: parseInt(g.count, 10),
        })),
      };
    } catch (error) {
      logger.error('[SettingsRepository] 获取设置统计失败', { error });
      throw error;
    }
  }

  /**
   * 删除设置
   */
  async deleteByKey(key: string): Promise<boolean> {
    try {
      const result = await this.settingsRepository.delete({ key });
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error('[SettingsRepository] 删除设置失败', { key, error });
      throw error;
    }
  }

  /**
   * 批量删除设置
   */
  async deleteByKeys(keys: string[]): Promise<number> {
    try {
      const result = await this.settingsRepository.delete({
        key: In(keys),
      });
      return result.affected || 0;
    } catch (error) {
      logger.error('[SettingsRepository] 批量删除设置失败', { keys, error });
      throw error;
    }
  }

  /**
   * 获取设置值（带默认值）
   */
  async getValue<T = string>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const setting = await this.findByKey(key);
      if (!setting) {
        return defaultValue || null;
      }

      // 尝试解析JSON
      try {
        return JSON.parse(setting.value) as T;
      } catch {
        return setting.value as unknown as T;
      }
    } catch (error) {
      logger.error('[SettingsRepository] 获取设置值失败', { key, error });
      return defaultValue || null;
    }
  }

  /**
   * 检查设置是否存在
   */
  async exists(key: string): Promise<boolean> {
    try {
      const count = await this.settingsRepository.count({
        where: { key },
      });
      return count > 0;
    } catch (error) {
      logger.error('[SettingsRepository] 检查设置存在失败', { key, error });
      return false;
    }
  }
}

export const settingsRepository = new SettingsRepository(dataSource);
export default settingsRepository;