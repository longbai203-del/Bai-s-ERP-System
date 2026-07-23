import { BaseRepository } from '../repositories/BaseRepository';
import { SystemSettingModel, CompanyInfoModel, EmailConfigModel } from '../models/Settings.model';

export class SystemSettingRepository extends BaseRepository<any> {
  constructor() {
    super(SystemSettingModel);
  }
  
  async getByKey(key: string): Promise<any> {
    return this.model.findOne({ key });
  }
  
  async getByCategory(category: string): Promise<any[]> {
    return this.model.find({ category });
  }
  
  async getMultipleKeys(keys: string[]): Promise<any[]> {
    return this.model.find({ key: { $in: keys } });
  }
}

export class CompanyInfoRepository extends BaseRepository<any> {
  constructor() {
    super(CompanyInfoModel);
  }
  
  async getActiveCompany(): Promise<any> {
    return this.model.findOne().sort({ createdAt: -1 });
  }
}

export class EmailConfigRepository extends BaseRepository<any> {
  constructor() {
    super(EmailConfigModel);
  }
  
  async getActiveConfig(): Promise<any> {
    return this.model.findOne({ isActive: true });
  }
}
