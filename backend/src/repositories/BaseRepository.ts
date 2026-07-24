/**
 * @file Repositories/BaseRepository.ts
 * 基础仓储类 - 提供通用CRUD操作
 */

import { Repository, DeepPartial, FindOptionsWhere, FindOptionsOrder, FindManyOptions, DataSource, EntityTarget } from 'typeorm';
import { logger } from '../Config/winston.config';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseRepository<T extends { id: number }> {
  protected repository: Repository<T>;
  protected entityName: string;

  constructor(dataSource: DataSource, entity: EntityTarget<T>) {
    this.repository = dataSource.getRepository(entity);
    this.entityName = entity instanceof Function ? entity.name : 'Entity';
  }

  /**
   * 创建新记录
   */
  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      const saved = await this.repository.save(entity);
      logger.debug(`[${this.entityName}] 创建成功`, { id: saved.id });
      return saved;
    } catch (error) {
      logger.error(`[${this.entityName}] 创建失败`, { error });
      throw error;
    }
  }

  /**
   * 批量创建
   */
  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      const entities = this.repository.create(data);
      const saved = await this.repository.save(entities);
      logger.debug(`[${this.entityName}] 批量创建成功`, { count: saved.length });
      return saved;
    } catch (error) {
      logger.error(`[${this.entityName}] 批量创建失败`, { error });
      throw error;
    }
  }

  /**
   * 根据ID查找
   */
  async findById(id: number, relations?: string[]): Promise<T | null> {
    try {
      const options: any = { where: { id } as FindOptionsWhere<T> };
      if (relations && relations.length > 0) {
        options.relations = relations;
      }
      return await this.repository.findOne(options);
    } catch (error) {
      logger.error(`[${this.entityName}] 查找失败`, { id, error });
      throw error;
    }
  }

  /**
   * 查找所有记录
   */
  async findAll(options?: {
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
    relations?: string[];
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    try {
      const findOptions: FindManyOptions<T> = {};
      if (options?.where) findOptions.where = options.where;
      if (options?.order) findOptions.order = options.order;
      if (options?.relations) findOptions.relations = options.relations;
      if (options?.skip) findOptions.skip = options.skip;
      if (options?.take) findOptions.take = options.take;

      return await this.repository.find(findOptions);
    } catch (error) {
      logger.error(`[${this.entityName}] 查找所有失败`, { error });
      throw error;
    }
  }

  /**
   * 分页查询
   */
  async findWithPagination(
    options: PaginationOptions,
    where?: FindOptionsWhere<T>,
    relations?: string[]
  ): Promise<PaginatedResult<T>> {
    try {
      const { page, limit, sortBy, sortOrder } = options;
      const skip = (page - 1) * limit;

      const order: FindOptionsOrder<T> = {};
      if (sortBy) {
        order[sortBy as keyof T] = sortOrder || 'asc';
      }

      const [items, total] = await this.repository.findAndCount({
        where,
        order,
        relations,
        skip,
        take: limit,
      });

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error(`[${this.entityName}] 分页查询失败`, { error });
      throw error;
    }
  }

  /**
   * 更新记录
   */
  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    try {
      await this.repository.update(id, data as any);
      return await this.findById(id);
    } catch (error) {
      logger.error(`[${this.entityName}] 更新失败`, { id, error });
      throw error;
    }
  }

  /**
   * 删除记录
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error(`[${this.entityName}] 删除失败`, { id, error });
      throw error;
    }
  }

  /**
   * 软删除
   */
  async softDelete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.softDelete(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error(`[${this.entityName}] 软删除失败`, { id, error });
      throw error;
    }
  }

  /**
   * 恢复软删除
   */
  async restore(id: number): Promise<boolean> {
    try {
      const result = await this.repository.restore(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error(`[${this.entityName}] 恢复失败`, { id, error });
      throw error;
    }
  }

  /**
   * 统计记录数
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    try {
      return await this.repository.count({ where });
    } catch (error) {
      logger.error(`[${this.entityName}] 统计失败`, { error });
      throw error;
    }
  }

  /**
   * 检查记录是否存在
   */
  async exists(id: number): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { id } as FindOptionsWhere<T>,
      });
      return count > 0;
    } catch (error) {
      logger.error(`[${this.entityName}] 检查存在失败`, { id, error });
      throw error;
    }
  }

  /**
   * 批量删除
   */
  async deleteMany(ids: number[]): Promise<number> {
    try {
      const result = await this.repository.delete(ids);
      return result.affected || 0;
    } catch (error) {
      logger.error(`[${this.entityName}] 批量删除失败`, { ids, error });
      throw error;
    }
  }

  /**
   * 获取原生Repository
   */
  getRepository(): Repository<T> {
    return this.repository;
  }

  /**
   * 执行原生查询
   */
  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.repository.query(query, parameters);
    } catch (error) {
      logger.error(`[${this.entityName}] 原生查询失败`, { query, error });
      throw error;
    }
  }
}