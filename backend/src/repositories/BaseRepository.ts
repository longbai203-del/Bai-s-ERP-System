export abstract class BaseRepository<T> {
  protected model: any;
  
  constructor(model: any) {
    this.model = model;
  }

  // ===== 基础 CRUD =====

  async findById(id: string): Promise<T | null> {
    if (!id) return null;
    return this.model.findById(id);
  }

  async findOne(filter: any): Promise<T | null> {
    if (!filter || Object.keys(filter).length === 0) return null;
    return this.model.findOne(filter);
  }

  async findAll(filter: any = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!id) return null;
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false;
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  // ===== 分页 =====

  async paginate(filter: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit),
      this.model.countDocuments(filter)
    ]);
    return { 
      data, 
      total, 
      page, 
      limit, 
      totalPages: Math.ceil(total / limit) 
    };
  }

  // ===== 批量操作 =====

  async batchDelete(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;
    const result = await this.model.deleteMany({ _id: { $in: ids } });
    return result.deletedCount || 0;
  }

  async batchUpdate(ids: string[], data: Partial<T>): Promise<number> {
    if (!ids || ids.length === 0 || !data || Object.keys(data).length === 0) return 0;
    const result = await this.model.updateMany(
      { _id: { $in: ids } },
      { $set: data }
    );
    return result.modifiedCount || 0;
  }

  // ===== 计数 =====

  async count(filter: any = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async exists(filter: any): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }
}
