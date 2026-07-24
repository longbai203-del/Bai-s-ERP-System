import { BaseRepository } from '../repositories/BaseRepository';

export abstract class BaseService<T> {
  protected repository: BaseRepository<T>;
  
  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  // ===== 基础 CRUD =====
  
  async findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw new Error(`Failed to find by id: ${error.message}`);
    }
  }

  async findOne(filter: any): Promise<T | null> {
    try {
      return await this.repository.findOne(filter);
    } catch (error) {
      throw new Error(`Failed to find one: ${error.message}`);
    }
  }

  async findAll(filter?: any): Promise<T[]> {
    try {
      return await this.repository.findAll(filter);
    } catch (error) {
      throw new Error(`Failed to find all: ${error.message}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new Error(`Failed to create: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new Error(`Failed to update: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete: ${error.message}`);
    }
  }

  // ===== 分页 =====

  async paginate(filter: any, page: number = 1, limit: number = 10) {
    try {
      return await this.repository.paginate(filter, page, limit);
    } catch (error) {
      throw new Error(`Failed to paginate: ${error.message}`);
    }
  }

  // ===== 批量操作 =====

  async batchCreate(dataList: Partial<T>[]): Promise<T[]> {
    const results: T[] = [];
    for (const data of dataList) {
      results.push(await this.create(data));
    }
    return results;
  }

  async batchDelete(ids: string[]): Promise<number> {
    let count = 0;
    for (const id of ids) {
      const result = await this.delete(id);
      if (result) count++;
    }
    return count;
  }

  // ===== 验证 =====

  protected validateId(id: string): void {
    if (!id) {
      throw new Error('ID is required');
    }
  }

  protected validateData(data: Partial<T>): void {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data is required');
    }
  }
}
