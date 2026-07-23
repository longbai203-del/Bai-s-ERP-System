export abstract class BaseRepository<T> {
  protected model: any;
  
  constructor(model: any) {
    this.model = model;
  }
  
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }
  
  async findAll(filter: any = {}): Promise<T[]> {
    return this.model.find(filter);
  }
  
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
  
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
  
  async paginate(filter: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit),
      this.model.countDocuments(filter)
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
