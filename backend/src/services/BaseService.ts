import { BaseRepository } from '../repositories/BaseRepository';

export abstract class BaseService<T> {
  protected repository: BaseRepository<T>;
  
  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }
  
  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }
  
  async findAll(filter?: any): Promise<T[]> {
    return this.repository.findAll(filter);
  }
  
  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }
  
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }
  
  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
  
  async paginate(filter: any, page: number, limit: number) {
    return this.repository.paginate(filter, page, limit);
  }
}
