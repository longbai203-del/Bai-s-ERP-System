import { BaseRepository } from './BaseRepository';
import { SystemSettingModel, CompanyInfoModel, EmailConfigModel } from '../models/Settings.model';

export class SystemSettingRepository extends BaseRepository<any> {
  constructor() {
    super(SystemSettingModel);
  }

  async getByKey(key: string): Promise<any | null> {
    if (!key) return null;
    return this.model.findOne({ key });
  }

  async getByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.model.find({ category });
  }

  async getMultipleKeys(keys: string[]): Promise<any[]> {
    if (!keys || keys.length === 0) return [];
    return this.model.find({ key: { $in: keys } });
  }

  async upsertSetting(key: string, value: any, category: string, description: string): Promise<any> {
    return this.model.findOneAndUpdate(
      { key },
      { value, category, description },
      { upsert: true, new: true }
    );
  }
}

export class CompanyInfoRepository extends BaseRepository<any> {
  constructor() {
    super(CompanyInfoModel);
  }

  async getActiveCompany(): Promise<any | null> {
    return this.model.findOne().sort({ createdAt: -1 });
  }

  async upsertCompany(data: any): Promise<any> {
    const existing = await this.model.findOne();
    if (existing) {
      return this.model.findByIdAndUpdate(existing._id, data, { new: true });
    }
    return this.model.create(data);
  }
}

export class EmailConfigRepository extends BaseRepository<any> {
  constructor() {
    super(EmailConfigModel);
  }

  async getActiveConfig(): Promise<any | null> {
    return this.model.findOne({ isActive: true });
  }

  async setActiveConfig(id: string): Promise<any | null> {
    await this.model.updateMany({ isActive: true }, { isActive: false });
    return this.model.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }
}
