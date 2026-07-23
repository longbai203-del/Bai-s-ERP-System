import { BaseService } from '../services/BaseService';
import { SystemSettingRepository, CompanyInfoRepository, EmailConfigRepository } from '../repositories/Settings.repository';

export class SystemSettingService extends BaseService<any> {
  private systemSettingRepository: SystemSettingRepository;
  
  constructor() {
    super(new SystemSettingRepository());
    this.systemSettingRepository = new SystemSettingRepository();
  }
  
  async getByKey(key: string): Promise<any> {
    const setting = await this.systemSettingRepository.getByKey(key);
    return setting ? setting.value : null;
  }
  
  async setSetting(key: string, value: any, category: string, description: string): Promise<any> {
    const existing = await this.systemSettingRepository.getByKey(key);
    if (existing) {
      return this.repository.update(existing._id, {
        value,
        category,
        description,
        updatedAt: new Date()
      });
    }
    return this.repository.create({
      key,
      value,
      category,
      description,
      createdAt: new Date()
    });
  }
  
  async getByCategory(category: string): Promise<any[]> {
    return this.systemSettingRepository.getByCategory(category);
  }
  
  async getMultipleKeys(keys: string[]): Promise<any> {
    const settings = await this.systemSettingRepository.getMultipleKeys(keys);
    const result: any = {};
    settings.forEach(s => { result[s.key] = s.value; });
    return result;
  }
}

export class CompanyInfoService extends BaseService<any> {
  private companyInfoRepository: CompanyInfoRepository;
  
  constructor() {
    super(new CompanyInfoRepository());
    this.companyInfoRepository = new CompanyInfoRepository();
  }
  
  async getCompanyInfo(): Promise<any> {
    return this.companyInfoRepository.getActiveCompany();
  }
  
  async updateCompanyInfo(data: any): Promise<any> {
    const existing = await this.companyInfoRepository.getActiveCompany();
    if (existing) {
      return this.repository.update(existing._id, { ...data, updatedAt: new Date() });
    }
    return this.repository.create(data);
  }
}

export class EmailConfigService extends BaseService<any> {
  private emailConfigRepository: EmailConfigRepository;
  
  constructor() {
    super(new EmailConfigRepository());
    this.emailConfigRepository = new EmailConfigRepository();
  }
  
  async getActiveConfig(): Promise<any> {
    return this.emailConfigRepository.getActiveConfig();
  }
  
  async setActiveConfig(id: string): Promise<any> {
    await this.repository.updateMany({ isActive: true }, { isActive: false });
    return this.repository.update(id, { isActive: true });
  }
}
