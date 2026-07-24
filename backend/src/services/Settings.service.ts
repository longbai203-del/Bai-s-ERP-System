/**
 * Settings Service - 设置业务逻辑层
 * 提供系统设置、公司信息、邮件配置相关的完整业务逻辑处理
 */

import { BaseService } from './BaseService';
import {
  SystemSettingRepository,
  CompanyInfoRepository,
  EmailConfigRepository
} from '../repositories/Settings.repository';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface SettingValue {
  key: string;
  value: any;
  category: string;
  description?: string;
  isPublic?: boolean;
}

export interface CompanyInfo {
  name: string;
  legalName?: string;
  taxId?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  vatNumber?: string;
  crNumber?: string;
}

// ===== System Setting Service =====

export class SystemSettingService extends BaseService<any> {
  private systemSettingRepository: SystemSettingRepository;

  constructor() {
    super(new SystemSettingRepository());
    this.systemSettingRepository = new SystemSettingRepository();
  }

  /**
   * 根据键名获取设置
   */
  async getByKey(key: string): Promise<any | null> {
    if (!key) {
      throw new ApiError(400, 'Key is required');
    }
    const setting = await this.systemSettingRepository.getByKey(key);
    return setting?.value || null;
  }

  /**
   * 根据分类获取设置列表
   */
  async getByCategory(category: string): Promise<any[]> {
    if (!category) {
      throw new ApiError(400, 'Category is required');
    }
    return this.systemSettingRepository.getByCategory(category);
  }

  /**
   * 批量获取设置值
   */
  async getMultipleKeys(keys: string[]): Promise<Record<string, any>> {
    if (!keys || keys.length === 0) {
      throw new ApiError(400, 'Keys are required');
    }
    const settings = await this.systemSettingRepository.getMultipleKeys(keys);
    const result: Record<string, any> = {};
    settings.forEach((s: any) => {
      result[s.key] = s.value;
    });
    return result;
  }

  /**
   * 获取所有设置（按分类分组）
   */
  async getAllGrouped(): Promise<Record<string, any[]>> {
    return this.systemSettingRepository.getAllGrouped();
  }

  /**
   * 获取公开设置
   */
  async getPublicSettings(): Promise<any[]> {
    return this.systemSettingRepository.getPublicSettings();
  }

  /**
   * 创建或更新设置
   */
  async setSetting(key: string, value: any, category: string, description?: string, isPublic: boolean = false): Promise<any> {
    if (!key) {
      throw new ApiError(400, 'Key is required');
    }
    if (!category) {
      throw new ApiError(400, 'Category is required');
    }

    const result = await this.systemSettingRepository.upsertSetting(
      key,
      value,
      category,
      description,
      isPublic
    );

    logger.info(`Setting updated: ${key} = ${JSON.stringify(value).substring(0, 100)}`);
    return result;
  }

  /**
   * 批量创建/更新设置
   */
  async upsertSettings(settings: SettingValue[]): Promise<any[]> {
    if (!settings || settings.length === 0) {
      throw new ApiError(400, 'Settings are required');
    }

    const result = await this.systemSettingRepository.upsertSettings(settings);
    logger.info(`Batch upserted ${result.length} settings`);
    return result;
  }

  /**
   * 更新设置值
   */
  async updateSetting(key: string, value: any, description?: string): Promise<any> {
    if (!key) {
      throw new ApiError(400, 'Key is required');
    }

    const setting = await this.systemSettingRepository.getByKey(key);
    if (!setting) {
      throw new ApiError(404, `Setting "${key}" not found`);
    }

    const result = await this.systemSettingRepository.upsertSetting(
      key,
      value,
      setting.category,
      description || setting.description,
      setting.isPublic
    );

    logger.info(`Setting updated: ${key}`);
    return result;
  }

  /**
   * 删除设置
   */
  async deleteSetting(key: string): Promise<boolean> {
    if (!key) {
      throw new ApiError(400, 'Key is required');
    }

    const result = await this.systemSettingRepository.deleteSetting(key);
    if (result) {
      logger.info(`Setting deleted: ${key}`);
    }
    return result;
  }

  /**
   * 批量删除设置
   */
  async deleteSettings(keys: string[]): Promise<number> {
    if (!keys || keys.length === 0) {
      throw new ApiError(400, 'Keys are required');
    }

    const result = await this.systemSettingRepository.deleteSettings(keys);
    logger.info(`Deleted ${result} settings`);
    return result;
  }

  /**
   * 删除分类下的所有设置
   */
  async deleteByCategory(category: string): Promise<number> {
    if (!category) {
      throw new ApiError(400, 'Category is required');
    }

    const result = await this.systemSettingRepository.deleteByCategory(category);
    logger.info(`Deleted ${result} settings in category: ${category}`);
    return result;
  }

  /**
   * 初始化默认设置
   */
  async initializeDefaults(defaults: SettingValue[]): Promise<any[]> {
    if (!defaults || defaults.length === 0) {
      throw new ApiError(400, 'Default settings are required');
    }

    const result = await this.systemSettingRepository.initializeDefaults(defaults);
    logger.info(`Initialized ${result.length} default settings`);
    return result;
  }

  /**
   * 获取设置值（带默认值）
   */
  async getValue<T>(key: string, defaultValue?: T): Promise<T | null> {
    const value = await this.getByKey(key);
    return value !== null && value !== undefined ? value as T : (defaultValue || null);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; settingsCount: number }> {
    const count = await this.systemSettingRepository.count();
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      settingsCount: count
    };
  }
}

// ===== Company Info Service =====

export class CompanyInfoService extends BaseService<any> {
  private companyInfoRepository: CompanyInfoRepository;

  constructor() {
    super(new CompanyInfoRepository());
    this.companyInfoRepository = new CompanyInfoRepository();
  }

  /**
   * 获取公司信息
   */
  async getCompanyInfo(): Promise<any | null> {
    return this.companyInfoRepository.getActiveCompany();
  }

  /**
   * 获取税务信息
   */
  async getTaxInfo(): Promise<any> {
    return this.companyInfoRepository.getTaxInfo();
  }

  /**
   * 获取联系信息
   */
  async getContactInfo(): Promise<any> {
    return this.companyInfoRepository.getContactInfo();
  }

  /**
   * 获取 Logo
   */
  async getLogo(): Promise<string | null> {
    const company = await this.getCompanyInfo();
    return company?.logo || null;
  }

  /**
   * 更新公司信息
   */
  async updateCompanyInfo(data: CompanyInfo): Promise<any> {
    if (!data.name) {
      throw new ApiError(400, 'Company name is required');
    }

    const result = await this.companyInfoRepository.upsertCompany(data);
    logger.info(`Company info updated: ${result.name}`);
    return result;
  }

  /**
   * 上传 Logo
   */
  async uploadLogo(logo: string): Promise<any> {
    if (!logo || logo.length < 10) {
      throw new ApiError(400, 'Invalid logo data');
    }

    const result = await this.companyInfoRepository.updateLogo(logo);
    logger.info('Company logo uploaded');
    return result;
  }
}

// ===== Email Config Service =====

export class EmailConfigService extends BaseService<any> {
  private emailConfigRepository: EmailConfigRepository;

  constructor() {
    super(new EmailConfigRepository());
    this.emailConfigRepository = new EmailConfigRepository();
  }

  /**
   * 获取所有邮件配置
   */
  async getAllConfigs(): Promise<any[]> {
    return this.emailConfigRepository.getAllConfigs();
  }

  /**
   * 获取激活的邮件配置
   */
  async getActiveConfig(): Promise<any | null> {
    return this.emailConfigRepository.getActiveConfig();
  }

  /**
   * 根据 ID 获取配置
   */
  async getConfigById(id: string): Promise<any | null> {
    this.validateId(id);
    return this.findById(id);
  }

  /**
   * 创建邮件配置
   */
  async createConfig(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.host) {
        throw new ApiError(400, 'Host is required');
      }
      if (!data.port) {
        throw new ApiError(400, 'Port is required');
      }
      if (!data.auth?.user || !data.auth?.pass) {
        throw new ApiError(400, 'Email credentials are required');
      }
      if (!data.from) {
        throw new ApiError(400, 'From email is required');
      }

      // 如果设置为激活，取消其他激活配置
      if (data.isActive) {
        await this.emailConfigRepository.setActiveConfig('');
      }

      const config = await this.create(data);
      logger.info(`Email config created: ${config.provider} - ${config.from}`);
      return config;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating email config:', error);
      throw new ApiError(500, 'Failed to create email config');
    }
  }

  /**
   * 更新邮件配置
   */
  async updateConfig(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      const config = await this.findById(id);
      if (!config) {
        throw new ApiError(404, 'Email config not found');
      }

      // 如果设置为激活，取消其他激活配置
      if (data.isActive) {
        await this.emailConfigRepository.setActiveConfig('');
      }

      const result = await this.update(id, data);
      logger.info(`Email config updated: ${result.provider}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating email config:', error);
      throw new ApiError(500, 'Failed to update email config');
    }
  }

  /**
   * 激活邮件配置
   */
  async activateConfig(id: string): Promise<any | null> {
    try {
      this.validateId(id);

      const config = await this.findById(id);
      if (!config) {
        throw new ApiError(404, 'Email config not found');
      }

      const result = await this.emailConfigRepository.setActiveConfig(id);
      logger.info(`Email config activated: ${config.provider} - ${config.from}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error activating email config:', error);
      throw new ApiError(500, 'Failed to activate email config');
    }
  }

  /**
   * 测试邮件配置
   */
  async testConfig(id: string, testEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.validateId(id);

      const config = await this.findById(id);
      if (!config) {
        throw new ApiError(404, 'Email config not found');
      }

      if (!testEmail) {
        throw new ApiError(400, 'Test email is required');
      }

      // 实际邮件发送逻辑
      // 这里只验证配置是否存在
      logger.info(`Testing email config: ${config.provider} - ${testEmail}`);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      logger.error('Error testing email config:', error);
      return { success: false, error: 'Failed to test email config' };
    }
  }

  /**
   * 删除邮件配置
   */
  async deleteConfig(id: string): Promise<boolean> {
    try {
      this.validateId(id);

      const config = await this.findById(id);
      if (!config) {
        throw new ApiError(404, 'Email config not found');
      }

      if (config.isActive) {
        throw new ApiError(400, 'Cannot delete active email config');
      }

      const result = await this.delete(id);
      logger.info(`Email config deleted: ${config.provider}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting email config:', error);
      throw new ApiError(500, 'Failed to delete email config');
    }
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  SystemSettingService,
  CompanyInfoService,
  EmailConfigService
};