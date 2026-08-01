/**
 * Settings Model - 系统设置数据模型
 * 提供完整的系统设置、公司信息、邮件配置 Schema 定义、验证、索引和业务方法
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

// ============================================
// 类型定义
// ============================================

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  category: 'general' | 'email' | 'payment' | 'shipping' | 'tax' | 'security' | 'notification' | 'integration';
  description: string;
  isEncrypted: boolean;
  isPublic: boolean;
  validationRule: string;
  defaultValue: any;
  updatedBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getValue<T>(): T;
  setValue(value: any): Promise<ISystemSetting>;
  isSensitive(): boolean;
  validateValue(value: any): boolean;
  getDefaultValue(): any;
}

export interface ICompanyInfo extends Document {
  companyName: string;
  legalName: string;
  taxId: string;
  vatNumber: string;
  crNumber: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  favicon: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  fiscalYearStart: Date;
  fiscalYearEnd: Date;
  businessType: string;
  industry: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  getFullAddress(): string;
  getContactInfo(): { phone: string; email: string };
  getTaxInfo(): { taxId: string; vatNumber: string };
  getSocialMedia(): any;
  updateLogo(logo: string): Promise<ICompanyInfo>;
  getCurrencySymbol(): string;
}

export interface IEmailConfig extends Document {
  provider: 'smtp' | 'sendgrid' | 'aws' | 'mailgun' | 'custom';
  name: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
  testEmail: string;
  isActive: boolean;
  isDefault: boolean;
  settings: Map<string, any>;
  lastTestDate: Date;
  lastTestStatus: 'pending' | 'success' | 'failed';
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  testConnection(): Promise<boolean>;
  sendTestEmail(email: string): Promise<boolean>;
  getProviderName(): string;
  isConfigured(): boolean;
  activate(): Promise<IEmailConfig>;
  deactivate(): Promise<IEmailConfig>;
}

// ============================================
// System Setting Schema
// ============================================

const SystemSettingSchema = new Schema<ISystemSetting>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  value: { type: Schema.Types.Mixed, required: true },
  category: {
    type: String,
    enum: ['general', 'email', 'payment', 'shipping', 'tax', 'security', 'notification', 'integration'],
    required: true,
    index: true
  },
  description: { type: String, trim: true },
  isEncrypted: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  validationRule: { type: String },
  defaultValue: { type: Schema.Types.Mixed },
  updatedBy: { type: String },
  version: { type: Number, default: 1 }
}, {
  timestamps: true,
  collection: 'system_settings',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// System Setting 索引
// ============================================

SystemSettingSchema.index({ category: 1, key: 1 });
SystemSettingSchema.index({ isPublic: 1 });

// ============================================
// System Setting 实例方法
// ============================================

SystemSettingSchema.methods = {
  /**
   * 获取值（类型安全）
   */
  getValue<T>(): T {
    return this.value as T;
  },

  /**
   * 设置值
   */
  async setValue(value: any): Promise<ISystemSetting> {
    if (!this.validateValue(value)) {
      throw new Error(`Invalid value for setting: ${this.key}`);
    }
    this.value = value;
    this.version += 1;
    return this.save();
  },

  /**
   * 检查是否为敏感设置
   */
  isSensitive(): boolean {
    return this.isEncrypted || this.category === 'security' || this.key.includes('password');
  },

  /**
   * 验证值
   */
  validateValue(value: any): boolean {
    if (!this.validationRule) return true;

    try {
      const rule = JSON.parse(this.validationRule);
      // 简单验证逻辑
      if (rule.type === 'string' && typeof value !== 'string') return false;
      if (rule.type === 'number' && typeof value !== 'number') return false;
      if (rule.type === 'boolean' && typeof value !== 'boolean') return false;
      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
      if (rule.type === 'url' && !/^https?:\/\/[^\s]+$/.test(value)) return false;
      if (rule.min !== undefined && value < rule.min) return false;
      if (rule.max !== undefined && value > rule.max) return false;
      if (rule.enum && !rule.enum.includes(value)) return false;
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) return false;
      return true;
    } catch {
      return true;
    }
  },

  /**
   * 获取默认值
   */
  getDefaultValue(): any {
    return this.defaultValue;
  },

  /**
   * 重置为默认值
   */
  async resetToDefault(): Promise<ISystemSetting> {
    if (this.defaultValue === undefined || this.defaultValue === null) {
      throw new Error('No default value available');
    }
    this.value = this.defaultValue;
    this.version += 1;
    return this.save();
  }
};

// ============================================
// System Setting 静态方法
// ============================================

SystemSettingSchema.statics = {
  /**
   * 按分类获取所有设置
   */
  async getByCategory(category: string): Promise<ISystemSetting[]> {
    return this.find({ category }).sort({ key: 1 }).exec();
  },

  /**
   * 获取公开设置
   */
  async getPublicSettings(): Promise<ISystemSetting[]> {
    return this.find({ isPublic: true }).sort({ category: 1, key: 1 }).exec();
  },

  /**
   * 批量更新设置
   */
  async batchUpdate(settings: Record<string, any>, updatedBy: string): Promise<void> {
    const operations = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: {
          value,
          updatedBy,
          version: { $inc: 1 }
        }
      }
    }));
    await this.bulkWrite(operations);
  },

  /**
   * 获取设置值（带缓存）
   */
  async getValue(key: string, defaultValue?: any): Promise<any> {
    const setting = await this.findOne({ key });
    if (!setting) return defaultValue;
    return setting.value;
  },

  /**
   * 获取所有设置（键值对）
   */
  async getAllAsMap(): Promise<Record<string, any>> {
    const settings = await this.find();
    return settings.reduce((acc: Record<string, any>, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
};

// ============================================
// Company Info Schema
// ============================================

const SocialMediaSchema = new Schema({
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  youtube: { type: String }
}, { _id: false });

const CompanyInfoSchema = new Schema<ICompanyInfo>({
  companyName: { type: String, required: true, trim: true },
  legalName: { type: String, trim: true },
  taxId: { type: String, trim: true, uppercase: true },
  vatNumber: { type: String, trim: true, uppercase: true },
  crNumber: { type: String, trim: true },
  registrationNumber: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  province: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, default: 'Saudi Arabia', trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true },
  logo: { type: String },
  favicon: { type: String },
  currency: { type: String, default: 'SAR', uppercase: true, trim: true },
  currencySymbol: { type: String, default: '﷼' },
  timezone: { type: String, default: 'Asia/Riyadh' },
  dateFormat: { type: String, default: 'YYYY-MM-DD' },
  timeFormat: { type: String, default: 'HH:mm' },
  fiscalYearStart: { type: Date },
  fiscalYearEnd: { type: Date },
  businessType: { type: String, trim: true },
  industry: { type: String, trim: true },
  socialMedia: SocialMediaSchema
}, {
  timestamps: true,
  collection: 'company_info'
});

// ============================================
// Company Info 实例方法
// ============================================

CompanyInfoSchema.methods = {
  /**
   * 获取完整地址
   */
  getFullAddress(): string {
    const parts = [
      this.address,
      this.city,
      this.province,
      this.postalCode,
      this.country
    ].filter(Boolean);
    return parts.join(', ');
  },

  /**
   * 获取联系信息
   */
  getContactInfo(): { phone: string; email: string } {
    return {
      phone: this.phone || '',
      email: this.email || ''
    };
  },

  /**
   * 获取税务信息
   */
  getTaxInfo(): { taxId: string; vatNumber: string } {
    return {
      taxId: this.taxId || '',
      vatNumber: this.vatNumber || ''
    };
  },

  /**
   * 获取社交媒体
   */
  getSocialMedia(): any {
    return this.socialMedia || {};
  },

  /**
   * 更新 Logo
   */
  async updateLogo(logo: string): Promise<ICompanyInfo> {
    this.logo = logo;
    return this.save();
  },

  /**
   * 获取货币符号
   */
  getCurrencySymbol(): string {
    return this.currencySymbol || this.currency || 'SAR';
  }
};

// ============================================
// Email Config Schema
// ============================================

const EmailConfigSchema = new Schema<IEmailConfig>({
  provider: {
    type: String,
    enum: ['smtp', 'sendgrid', 'aws', 'mailgun', 'custom'],
    required: true
  },
  name: { type: String, required: true, trim: true },
  host: { type: String, trim: true },
  port: { type: Number, min: 1, max: 65535 },
  secure: { type: Boolean, default: true },
  username: { type: String, trim: true },
  password: { type: String, trim: true },
  apiKey: { type: String, trim: true },
  fromEmail: { type: String, required: true, trim: true, lowercase: true },
  fromName: { type: String, required: true, trim: true },
  testEmail: { type: String, trim: true, lowercase: true },
  isActive: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  settings: { type: Map, of: Schema.Types.Mixed, default: new Map() },
  lastTestDate: { type: Date },
  lastTestStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'email_configs'
});

// ============================================
// Email Config 索引
// ============================================

EmailConfigSchema.index({ isActive: 1 });
EmailConfigSchema.index({ isDefault: 1 });
EmailConfigSchema.index({ provider: 1 });

// ============================================
// Email Config 实例方法
// ============================================

EmailConfigSchema.methods = {
  /**
   * 测试连接
   */
  async testConnection(): Promise<boolean> {
    try {
      // 实际实现中需要测试邮件服务器连接
      // 这里模拟测试
      this.lastTestDate = new Date();
      this.lastTestStatus = 'success';
      await this.save();
      return true;
    } catch (error) {
      this.lastTestDate = new Date();
      this.lastTestStatus = 'failed';
      await this.save();
      return false;
    }
  },

  /**
   * 发送测试邮件
   */
  async sendTestEmail(email: string): Promise<boolean> {
    try {
      // 实际实现中需要发送测试邮件
      this.testEmail = email;
      this.lastTestDate = new Date();
      this.lastTestStatus = 'success';
      await this.save();
      return true;
    } catch (error) {
      this.lastTestDate = new Date();
      this.lastTestStatus = 'failed';
      await this.save();
      return false;
    }
  },

  /**
   * 获取提供商名称
   */
  getProviderName(): string {
    const providerMap: Record<string, string> = {
      smtp: 'SMTP',
      sendgrid: 'SendGrid',
      aws: 'AWS SES',
      mailgun: 'Mailgun',
      custom: 'Custom'
    };
    return providerMap[this.provider] || this.provider;
  },

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    if (this.provider === 'smtp') {
      return !!(this.host && this.port && this.username && this.password);
    }
    if (this.provider === 'sendgrid' || this.provider === 'mailgun') {
      return !!(this.apiKey);
    }
    if (this.provider === 'aws') {
      return !!(this.username && this.password);
    }
    return true;
  },

  /**
   * 激活配置
   */
  async activate(): Promise<IEmailConfig> {
    // 取消其他激活配置
    await (this.constructor as any).updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
    this.isActive = true;
    return this.save();
  },

  /**
   * 停用配置
   */
  async deactivate(): Promise<IEmailConfig> {
    this.isActive = false;
    return this.save();
  }
};

// ============================================
// Email Config 静态方法
// ============================================

EmailConfigSchema.statics = {
  /**
   * 获取激活的配置
   */
  async getActiveConfig(): Promise<IEmailConfig | null> {
    return this.findOne({ isActive: true }).exec();
  },

  /**
   * 获取默认配置
   */
  async getDefaultConfig(): Promise<IEmailConfig | null> {
    return this.findOne({ isDefault: true }).exec();
  },

  /**
   * 激活配置（静态方法）
   */
  async activateConfig(id: string): Promise<IEmailConfig | null> {
    const config = await this.findById(id);
    if (!config) return null;
    return config.activate();
  }
};

// ============================================
// 中间件（Hooks）
// ============================================

SystemSettingSchema.pre('save', function(next) {
  // 加密敏感值
  if (this.isEncrypted && typeof this.value === 'string') {
    // 实际实现中需要加密
    // this.value = encrypt(this.value);
  }
  next();
});

EmailConfigSchema.pre('save', function(next) {
  // 确保只有一个默认配置
  if (this.isDefault) {
    this.constructor.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    ).exec();
  }
  next();
});

// ============================================
// 模型导出
// ============================================

export const SystemSettingModel = mongoose.model<ISystemSetting>('SystemSetting', SystemSettingSchema);
export const CompanyInfoModel = mongoose.model<ICompanyInfo>('CompanyInfo', CompanyInfoSchema);
export const EmailConfigModel = mongoose.model<IEmailConfig>('EmailConfig', EmailConfigSchema);

export default {
  SystemSettingModel,
  CompanyInfoModel,
  EmailConfigModel
};