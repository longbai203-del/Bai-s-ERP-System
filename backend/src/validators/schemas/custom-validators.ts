/**
 * 自定义验证器
 * 扩展Joi验证规则，包含企业级业务验证
 * @module validators/schemas/custom-validators
 */

import Joi from 'joi';

/**
 * 自定义验证器类
 * 包含各类业务场景的自定义验证规则
 */
export class CustomValidators {
  // ==================== 身份验证相关 ====================

  /**
   * 验证中国身份证号（18位）
   */
  static idCard(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      // 基本格式验证
      const pattern = /^[1-9]\d{5}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
      if (!pattern.test(value)) {
        return helpers.error('string.idCard', { value });
      }

      // 校验位验证
      const id = value.toUpperCase();
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(id[i]) * weights[i];
      }
      const checkCode = checkCodes[sum % 11];

      if (id[17] !== checkCode) {
        return helpers.error('string.idCard', { value });
      }

      // 验证出生日期
      const birthDate = new Date(
        parseInt(id.substring(6, 10)),
        parseInt(id.substring(10, 12)) - 1,
        parseInt(id.substring(12, 14))
      );
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        return helpers.error('string.idCard', { value });
      }

      return value;
    };
  }

  /**
   * 验证中国手机号
   */
  static phoneCN(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^1[3-9]\d{9}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.phoneCN', { value });
      }

      // 运营商号段验证
      const prefix = value.substring(0, 3);
      const validPrefixes = [
        '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
        '145', '146', '147', '148', '149',
        '150', '151', '152', '153', '155', '156', '157', '158', '159',
        '162', '165', '166', '167',
        '170', '171', '172', '173', '174', '175', '176', '177', '178',
        '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
        '190', '191', '192', '193', '195', '196', '197', '198', '199'
      ];

      if (!validPrefixes.includes(prefix)) {
        return helpers.error('string.phoneCN', { value });
      }

      return value;
    };
  }

  /**
   * 验证中国统一社会信用代码
   */
  static socialCreditCode(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.socialCreditCode', { value });
      }

      // 校验码验证
      const code = value.toUpperCase();
      const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
      const checkMap = '0123456789ABCDEFGHJKLMNPQRTUWXY';

      let sum = 0;
      for (let i = 0; i < 17; i++) {
        const char = code[i];
        const index = checkMap.indexOf(char);
        if (index === -1) {
          return helpers.error('string.socialCreditCode', { value });
        }
        sum += index * weights[i];
      }

      const checkChar = checkMap[31 - (sum % 31)];
      if (code[17] !== checkChar) {
        return helpers.error('string.socialCreditCode', { value });
      }

      return value;
    };
  }

  /**
   * 验证护照号码
   */
  static passport(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      // 中国护照：E开头+8位数字
      const cnPattern = /^E\d{8}$/;
      // 其他常见护照格式
      const otherPatterns = [
        /^[A-Z]{1,2}\d{6,9}$/,
        /^\d{7,9}$/,
        /^[A-Z]\d{7}$/,
      ];

      if (cnPattern.test(value)) {
        return value;
      }

      for (const pattern of otherPatterns) {
        if (pattern.test(value)) {
          return value;
        }
      }

      return helpers.error('string.passport', { value });
    };
  }

  // ==================== 金融相关验证 ====================

  /**
   * 验证信用卡号（Luhn算法）
   */
  static creditCard(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const sanitized = value.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(sanitized)) {
        return helpers.error('string.creditCard', { value });
      }

      // Luhn算法
      let sum = 0;
      let isEven = false;
      for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        isEven = !isEven;
      }

      if (sum % 10 !== 0) {
        return helpers.error('string.creditCard', { value });
      }

      // 检测信用卡品牌
      const brands = {
        VISA: /^4/,
        MASTERCARD: /^5[1-5]/,
        AMEX: /^3[47]/,
        DISCOVER: /^6(?:011|5)/,
        DINERS: /^3(?:0[0-5]|[68])/,
        JCB: /^(?:2131|1800|35)/,
      };

      let detectedBrand = 'UNKNOWN';
      for (const [brand, pattern] of Object.entries(brands)) {
        if (pattern.test(sanitized)) {
          detectedBrand = brand;
          break;
        }
      }

      // 存储品牌信息到上下文
      (helpers as any).state.brand = detectedBrand;

      return value;
    };
  }

  /**
   * 验证银行卡号
   */
  static bankCard(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const sanitized = value.replace(/\s/g, '');
      if (!/^\d{16,19}$/.test(sanitized)) {
        return helpers.error('string.bankCard', { value });
      }

      // Luhn验证
      let sum = 0;
      let isEven = false;
      for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        isEven = !isEven;
      }

      if (sum % 10 !== 0) {
        return helpers.error('string.bankCard', { value });
      }

      return value;
    };
  }

  /**
   * 验证金额（支持多种货币格式）
   */
  static amount(): Joi.CustomValidator<number> {
    return (value: number, helpers: Joi.CustomHelpers) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return helpers.error('number.amount', { value });
      }

      if (value < 0) {
        return helpers.error('number.amount.min', { value });
      }

      if (value > 999999999.99) {
        return helpers.error('number.amount.max', { value });
      }

      // 检查小数位数
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 4) {
        return helpers.error('number.amount.precision', { value });
      }

      return value;
    };
  }

  // ==================== 网络相关验证 ====================

  /**
   * 验证URL
   */
  static url(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      try {
        const url = new URL(value);
        if (!['http:', 'https:', 'ftp:', 'ws:', 'wss:'].includes(url.protocol)) {
          return helpers.error('string.url.protocol', { value });
        }

        // 检查域名是否有效
        if (!url.hostname || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          return value;
        }

        // 检查是否包含非法字符
        if (/[\s<>{}|\\^`]/.test(url.href)) {
          return helpers.error('string.url.invalid', { value });
        }

        return value;
      } catch {
        return helpers.error('string.url', { value });
      }
    };
  }

  /**
   * 验证IP地址（IPv4和IPv6）
   */
  static ip(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      // IPv4
      const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipv4Pattern.test(value)) {
        const parts = value.split('.');
        for (const part of parts) {
          const num = parseInt(part);
          if (num > 255) {
            return helpers.error('string.ip.ipv4', { value });
          }
        }
        return value;
      }

      // IPv6
      const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      if (ipv6Pattern.test(value)) {
        return value;
      }

      // IPv6压缩格式
      const ipv6CompressedPattern = /^(([0-9a-fA-F]{1,4}:)*:)([0-9a-fA-F]{1,4})?$/;
      if (ipv6CompressedPattern.test(value)) {
        const parts = value.split(':');
        if (parts.length >= 3 && parts.length <= 8) {
          return value;
        }
      }

      return helpers.error('string.ip', { value });
    };
  }

  /**
   * 验证MAC地址
   */
  static macAddress(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const patterns = [
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        /^([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}$/,
      ];

      for (const pattern of patterns) {
        if (pattern.test(value)) {
          return value;
        }
      }

      return helpers.error('string.macAddress', { value });
    };
  }

  // ==================== 密码与安全验证 ====================

  /**
   * 验证密码强度
   */
  static passwordStrength(
    minLength: number = 8,
    options?: {
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumber?: boolean;
      requireSpecial?: boolean;
      maxLength?: number;
      forbiddenPatterns?: RegExp[];
    }
  ): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      if (value.length < minLength) {
        return helpers.error('string.passwordStrength.min', { value, minLength });
      }

      if (options?.maxLength && value.length > options.maxLength) {
        return helpers.error('string.passwordStrength.max', { value, maxLength: options.maxLength });
      }

      // 检查常见弱密码
      const commonPasswords = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey',
        '123456789', '1234567890', 'qwerty123', '1q2w3e4r', 'iloveyou'
      ];
      if (commonPasswords.includes(value.toLowerCase())) {
        return helpers.error('string.passwordStrength.common', { value });
      }

      const opts = {
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: false,
        ...options,
      };

      if (opts.requireUppercase && !/[A-Z]/.test(value)) {
        return helpers.error('string.passwordStrength.uppercase', { value });
      }
      if (opts.requireLowercase && !/[a-z]/.test(value)) {
        return helpers.error('string.passwordStrength.lowercase', { value });
      }
      if (opts.requireNumber && !/\d/.test(value)) {
        return helpers.error('string.passwordStrength.number', { value });
      }
      if (opts.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return helpers.error('string.passwordStrength.special', { value });
      }

      // 检查连续字符
      if (/(.)\1{2,}/.test(value)) {
        return helpers.error('string.passwordStrength.repeated', { value });
      }

      // 检查顺序字符
      const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
      for (const seq of sequences) {
        for (let i = 0; i < seq.length - 2; i++) {
          if (value.toLowerCase().includes(seq.substring(i, i + 3))) {
            return helpers.error('string.passwordStrength.sequential', { value });
          }
        }
      }

      if (options?.forbiddenPatterns) {
        for (const pattern of options.forbiddenPatterns) {
          if (pattern.test(value)) {
            return helpers.error('string.passwordStrength.forbidden', { value });
          }
        }
      }

      // 计算密码强度分数
      let score = 0;
      if (value.length >= 12) score += 2;
      if (value.length >= 8) score += 1;
      if (/[A-Z]/.test(value)) score += 1;
      if (/[a-z]/.test(value)) score += 1;
      if (/\d/.test(value)) score += 1;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 1;
      if (!/(.)\1{2,}/.test(value)) score += 1;

      (helpers as any).state.passwordScore = Math.min(score, 7);

      return value;
    };
  }

  /**
   * 验证密码确认
   */
  static passwordMatch(passwordField: string = 'password'): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const password = (helpers.state as any).ancestors[0]?.[passwordField];
      if (value !== password) {
        return helpers.error('string.passwordMatch', { value });
      }
      return value;
    };
  }

  // ==================== 日期与时间验证 ====================

  /**
   * 验证日期范围
   */
  static dateRange(minDate?: Date | string, maxDate?: Date | string): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('string.dateRange.invalid', { value });
      }

      const min = minDate ? new Date(minDate) : null;
      const max = maxDate ? new Date(maxDate) : null;

      if (min && date < min) {
        return helpers.error('string.dateRange.min', { value, minDate: min.toISOString() });
      }
      if (max && date > max) {
        return helpers.error('string.dateRange.max', { value, maxDate: max.toISOString() });
      }

      // 检查是否为有效日期（非未来日期）
      const now = new Date();
      if (date > now) {
        return helpers.error('string.dateRange.future', { value });
      }

      return value;
    };
  }

  /**
   * 验证年龄
   */
  static age(minAge: number = 18, maxAge: number = 120): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const birthDate = new Date(value);
      if (isNaN(birthDate.getTime())) {
        return helpers.error('string.age.invalid', { value });
      }

      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return helpers.error('string.age.min', { value, minAge });
      }
      if (age > maxAge) {
        return helpers.error('string.age.max', { value, maxAge });
      }

      (helpers as any).state.age = age;

      return value;
    };
  }

  // ==================== 业务特定验证 ====================

  /**
   * 验证订单号格式
   */
  static orderNumber(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^[A-Z]{2,4}-\d{6,12}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.orderNumber', { value });
      }

      // 提取订单前缀和序号
      const [prefix, sequence] = value.split('-');
      (helpers as any).state.orderPrefix = prefix;
      (helpers as any).state.orderSequence = sequence;

      return value;
    };
  }

  /**
   * 验证SKU格式
   */
  static sku(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^[A-Z0-9]{2,4}-[A-Z0-9]{4,8}-[A-Z0-9]{2,4}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.sku', { value });
      }
      return value;
    };
  }

  /**
   * 验证条形码（EAN-13）
   */
  static ean13(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const sanitized = value.replace(/\s/g, '');
      if (!/^\d{13}$/.test(sanitized)) {
        return helpers.error('string.ean13', { value });
      }

      // 校验位验证
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(sanitized[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
      }
      const checkDigit = (10 - (sum % 10)) % 10;

      if (parseInt(sanitized[12]) !== checkDigit) {
        return helpers.error('string.ean13', { value });
      }

      return value;
    };
  }

  /**
   * 验证JSON格式
   */
  static json(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      try {
        const parsed = JSON.parse(value);
        (helpers as any).state.parsedJson = parsed;
        return value;
      } catch (error) {
        return helpers.error('string.json', { value });
      }
    };
  }

  /**
   * 验证数组唯一性
   */
  static uniqueArray<T = any>(): Joi.CustomValidator<T[]> {
    return (value: T[], helpers: Joi.CustomHelpers) => {
      if (!Array.isArray(value)) {
        return helpers.error('array.uniqueArray', { value });
      }

      const unique = new Set(value);
      if (unique.size !== value.length) {
        // 找出重复项
        const duplicates: T[] = [];
        const seen = new Set<T>();
        for (const item of value) {
          if (seen.has(item) && !duplicates.includes(item)) {
            duplicates.push(item);
          }
          seen.add(item);
        }
        return helpers.error('array.uniqueArray.duplicate', { value, duplicates });
      }

      return value;
    };
  }

  /**
   * 验证枚举值（增强版）
   */
  static enumExtended<T = any>(enumMap: Record<string, T>): Joi.CustomValidator<T> {
    return (value: T, helpers: Joi.CustomHelpers) => {
      const validValues = Object.values(enumMap);
      if (!validValues.includes(value)) {
        return helpers.error('any.enumExtended', {
          value,
          validValues: validValues.join(', '),
        });
      }
      return value;
    };
  }

  // ==================== 格式验证 ====================

  /**
   * 验证十六进制颜色值
   */
  static hexColor(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const patterns = [
        /^#([0-9A-Fa-f]{3})$/,
        /^#([0-9A-Fa-f]{6})$/,
        /^#([0-9A-Fa-f]{8})$/,
      ];

      for (const pattern of patterns) {
        if (pattern.test(value)) {
          return value;
        }
      }

      return helpers.error('string.hexColor', { value });
    };
  }

  /**
   * 验证坐标（经纬度）
   */
  static coordinates(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)$/;
      const match = value.match(pattern);
      if (!match) {
        return helpers.error('string.coordinates', { value });
      }

      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      if (lat < -90 || lat > 90) {
        return helpers.error('string.coordinates.lat', { value });
      }
      if (lng < -180 || lng > 180) {
        return helpers.error('string.coordinates.lng', { value });
      }

      (helpers as any).state.latitude = lat;
      (helpers as any).state.longitude = lng;

      return value;
    };
  }

  /**
   * 验证图片Base64格式
   */
  static imageBase64(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;
      if (!pattern.test(value)) {
        return helpers.error('string.imageBase64', { value });
      }

      // 检查大小（约10MB）
      const base64Data = value.replace(/^data:image\/\w+;base64,/, '');
      const sizeInBytes = Buffer.from(base64Data, 'base64').length;
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (sizeInBytes > maxSize) {
        return helpers.error('string.imageBase64.size', { value, maxSize: '10MB' });
      }

      return value;
    };
  }

  // ==================== 通用工具验证 ====================

  /**
   * 验证非空（增强版）
   */
  static notEmpty(): Joi.CustomValidator<any> {
    return (value: any, helpers: Joi.CustomHelpers) => {
      if (value === null || value === undefined) {
        return helpers.error('any.notEmpty', { value });
      }

      if (typeof value === 'string' && value.trim() === '') {
        return helpers.error('any.notEmpty', { value });
      }

      if (Array.isArray(value) && value.length === 0) {
        return helpers.error('any.notEmpty', { value });
      }

      if (typeof value === 'object' && Object.keys(value).length === 0) {
        return helpers.error('any.notEmpty', { value });
      }

      return value;
    };
  }

  /**
   * 验证数值范围（增强版）
   */
  static numericRange(
    min?: number,
    max?: number,
    options?: { integer?: boolean; precision?: number; minExclusive?: boolean; maxExclusive?: boolean }
  ): Joi.CustomValidator<number> {
    return (value: number, helpers: Joi.CustomHelpers) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return helpers.error('number.numericRange', { value });
      }

      if (options?.integer && !Number.isInteger(value)) {
        return helpers.error('number.numericRange.integer', { value });
      }

      if (options?.precision !== undefined) {
        const factor = Math.pow(10, options.precision);
        if (Math.round(value * factor) / factor !== value) {
          return helpers.error('number.numericRange.precision', { value, precision: options.precision });
        }
      }

      if (min !== undefined) {
        if (options?.minExclusive && value <= min) {
          return helpers.error('number.numericRange.minExclusive', { value, min });
        }
        if (!options?.minExclusive && value < min) {
          return helpers.error('number.numericRange.min', { value, min });
        }
      }

      if (max !== undefined) {
        if (options?.maxExclusive && value >= max) {
          return helpers.error('number.numericRange.maxExclusive', { value, max });
        }
        if (!options?.maxExclusive && value > max) {
          return helpers.error('number.numericRange.max', { value, max });
        }
      }

      return value;
    };
  }

  /**
   * 验证字符串长度范围（增强版）
   */
  static stringLength(
    min?: number,
    max?: number,
    options?: { trim?: boolean; countBytes?: boolean }
  ): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      if (typeof value !== 'string') {
        return helpers.error('string.stringLength', { value });
      }

      let actualValue = options?.trim ? value.trim() : value;
      let length = options?.countBytes ? Buffer.byteLength(actualValue, 'utf8') : actualValue.length;

      if (min !== undefined && length < min) {
        return helpers.error('string.stringLength.min', { value, min });
      }
      if (max !== undefined && length > max) {
        return helpers.error('string.stringLength.max', { value, max });
      }

      return value;
    };
  }

  /**
   * 验证多语言字符支持
   */
  static charset(options?: { allowEmoji?: boolean; allowChinese?: boolean; allowSpecial?: boolean }): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const opts = {
        allowEmoji: false,
        allowChinese: true,
        allowSpecial: true,
        ...options,
      };

      // 检查Emoji
      if (!opts.allowEmoji) {
        const emojiRegex = /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/u;
        if (emojiRegex.test(value)) {
          return helpers.error('string.charset.emoji', { value });
        }
      }

      // 检查中文
      if (!opts.allowChinese) {
        const chineseRegex = /[\u4E00-\u9FFF]/;
        if (chineseRegex.test(value)) {
          return helpers.error('string.charset.chinese', { value });
        }
      }

      // 检查特殊字符
      if (!opts.allowSpecial) {
        const specialRegex = /[^a-zA-Z0-9\s\u4E00-\u9FFF]/;
        if (specialRegex.test(value)) {
          return helpers.error('string.charset.special', { value });
        }
      }

      return value;
    };
  }
}

/**
 * 扩展Joi自定义验证器
 * 注册所有自定义验证器到Joi
 */
export function extendJoiWithCustomValidators(): void {
  const cv = CustomValidators;

  // 身份证
  Joi.extend((joi) => ({
    type: 'idCard',
    base: joi.string(),
    messages: {
      'string.idCard': '{{#label}} 不是有效的身份证号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.idCard()(value, helpers);
    },
  }));

  // 手机号
  Joi.extend((joi) => ({
    type: 'phoneCN',
    base: joi.string(),
    messages: {
      'string.phoneCN': '{{#label}} 不是有效的手机号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.phoneCN()(value, helpers);
    },
  }));

  // 统一社会信用代码
  Joi.extend((joi) => ({
    type: 'socialCreditCode',
    base: joi.string(),
    messages: {
      'string.socialCreditCode': '{{#label}} 不是有效的统一社会信用代码',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.socialCreditCode()(value, helpers);
    },
  }));

  // 信用卡
  Joi.extend((joi) => ({
    type: 'creditCard',
    base: joi.string(),
    messages: {
      'string.creditCard': '{{#label}} 不是有效的信用卡号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.creditCard()(value, helpers);
    },
  }));

  // 银行卡
  Joi.extend((joi) => ({
    type: 'bankCard',
    base: joi.string(),
    messages: {
      'string.bankCard': '{{#label}} 不是有效的银行卡号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.bankCard()(value, helpers);
    },
  }));

  // 密码强度
  Joi.extend((joi) => ({
    type: 'passwordStrength',
    base: joi.string(),
    messages: {
      'string.passwordStrength.min': '{{#label}} 密码长度至少为 {{#minLength}}',
      'string.passwordStrength.max': '{{#label}} 密码长度不能超过 {{#maxLength}}',
      'string.passwordStrength.uppercase': '{{#label}} 密码需要包含大写字母',
      'string.passwordStrength.lowercase': '{{#label}} 密码需要包含小写字母',
      'string.passwordStrength.number': '{{#label}} 密码需要包含数字',
      'string.passwordStrength.special': '{{#label}} 密码需要包含特殊字符',
      'string.passwordStrength.common': '{{#label}} 密码过于常见，请使用更复杂的密码',
      'string.passwordStrength.repeated': '{{#label}} 密码包含连续重复字符',
      'string.passwordStrength.sequential': '{{#label}} 密码包含顺序字符',
      'string.passwordStrength.forbidden': '{{#label}} 密码包含禁止的字符组合',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.passwordStrength(8, {
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: false,
      })(value, helpers);
    },
  }));

  // 密码确认
  Joi.extend((joi) => ({
    type: 'passwordMatch',
    base: joi.string(),
    messages: {
      'string.passwordMatch': '{{#label}} 与密码不匹配',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.passwordMatch()(value, helpers);
    },
  }));

  // 订单号
  Joi.extend((joi) => ({
    type: 'orderNumber',
    base: joi.string(),
    messages: {
      'string.orderNumber': '{{#label}} 不是有效的订单号格式',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.orderNumber()(value, helpers);
    },
  }));

  // SKU
  Joi.extend((joi) => ({
    type: 'sku',
    base: joi.string(),
    messages: {
      'string.sku': '{{#label}} 不是有效的SKU格式',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.sku()(value, helpers);
    },
  }));

  // EAN-13
  Joi.extend((joi) => ({
    type: 'ean13',
    base: joi.string(),
    messages: {
      'string.ean13': '{{#label}} 不是有效的EAN-13条形码',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.ean13()(value, helpers);
    },
  }));

  // JSON
  Joi.extend((joi) => ({
    type: 'json',
    base: joi.string(),
    messages: {
      'string.json': '{{#label}} 不是有效的JSON格式',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.json()(value, helpers);
    },
  }));

  // 非空
  Joi.extend((joi) => ({
    type: 'notEmpty',
    base: joi.any(),
    messages: {
      'any.notEmpty': '{{#label}} 不能为空',
    },
    validate: (value: any, helpers: Joi.CustomHelpers) => {
      return cv.notEmpty()(value, helpers);
    },
  }));

  // 十六进制颜色
  Joi.extend((joi) => ({
    type: 'hexColor',
    base: joi.string(),
    messages: {
      'string.hexColor': '{{#label}} 不是有效的十六进制颜色值',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.hexColor()(value, helpers);
    },
  }));

  // 坐标
  Joi.extend((joi) => ({
    type: 'coordinates',
    base: joi.string(),
    messages: {
      'string.coordinates': '{{#label}} 不是有效的坐标格式',
      'string.coordinates.lat': '{{#label}} 纬度值超出范围 (-90, 90)',
      'string.coordinates.lng': '{{#label}} 经度值超出范围 (-180, 180)',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.coordinates()(value, helpers);
    },
  }));

  // 图片Base64
  Joi.extend((joi) => ({
    type: 'imageBase64',
    base: joi.string(),
    messages: {
      'string.imageBase64': '{{#label}} 不是有效的图片Base64格式',
      'string.imageBase64.size': '{{#label}} 图片大小超过限制 {{#maxSize}}',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return cv.imageBase64()(value, helpers);
    },
  }));
}

export default CustomValidators;