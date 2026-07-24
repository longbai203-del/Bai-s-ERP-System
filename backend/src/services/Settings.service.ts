import { BaseService } from './BaseService';
import { SystemSettingRepository, CompanyInfoRepository, EmailConfigRepository } from '../repositories/Settings.repository';

export class SystemSettingService extends BaseService<any> {
  private systemSettingRepository: SystemSettingRepository;
  
  constructor() {
    super(new SystemSettingRepository());
    this.systemSettingRepository = new SystemSettingRepository();
  }

  async getByKey(key: string): Promise<any | null> {
    if (!key) return null;
    return this.systemSettingRepository.getByKey(key);
  }

  async getByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.systemSettingRepository.getByCategory(category);
  }

  async getMultipleKeys(keys: string[]): Promise<any> {
    if (!keys || keys.length === 0) return {};
    const settings = await this.systemSettingRepository.getMultipleKeys(keys);
    const result: any = {};
    settings.forEach((s: any) => { result[s.key] = s.value; });
    return result;
  }

  async setSetting(key: string, value: any, category: string, description: string): Promise<any> {
    if (!key) throw new Error('Key is required');
    return this.systemSettingRepository.upsertSetting(key, value, category, description);
  }
}

export class CompanyInfoService extends BaseService<any> {
  private companyInfoRepository: CompanyInfoRepository;
  
  constructor() {
    super(new CompanyInfoRepository());
    this.companyInfoRepository = new CompanyInfoRepository();
  }

  async getCompanyInfo(): Promise<any | null> {
    return this.companyInfoRepository.getActiveCompany();
  }

  async updateCompanyInfo(data: any): Promise<any> {
    return this.companyInfoRepository.upsertCompany(data);
  }
}

export class EmailConfigService extends BaseService<any> {
  private emailConfigRepository: EmailConfigRepository;
  
  constructor() {
    super(new EmailConfigRepository());
    this.emailConfigRepository = new EmailConfigRepository();
  }

  async getActiveConfig(): Promise<any | null> {
    return this.emailConfigRepository.getActiveConfig();
  }

  async setActiveConfig(id: string): Promise<any | null> {
    this.validateId(id);
    return this.emailConfigRepository.setActiveConfig(id);
  }
}
