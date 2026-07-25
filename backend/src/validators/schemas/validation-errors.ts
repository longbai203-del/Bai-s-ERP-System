/**
 * 自定义验证器
 * 扩展Joi验证规则
 * @module validators/schemas/custom-validators
 */

import Joi from 'joi';

/**
 * 自定义验证器类
 */
export class CustomValidators {
  /**
   * 验证中国身份证号
   */
  static idCard(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      // 18位身份证号验证
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

      return value;
    };
  }

  /**
   * 验证手机号（中国）
   */
  static phoneCN(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^1[3-9]\d{9}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.phoneCN', { value });
      }
      return value;
    };
  }

  /**
   * 验证统一社会信用代码
   */
  static socialCreditCode(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const pattern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
      if (!pattern.test(value)) {
        return helpers.error('string.socialCreditCode', { value });
      }
      return value;
    };
  }

  /**
   * 验证URL
   */
  static url(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return helpers.error('string.url', { value });
        }
        return value;
      } catch {
        return helpers.error('string.url', { value });
      }
    };
  }

  /**
   * 验证IP地址
   */
  static ip(): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      // IPv4
      const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipv4Pattern.test(value)) {
        const parts = value.split('.');
        for (const part of parts) {
          if (parseInt(part) > 255) {
            return helpers.error('string.ip', { value });
          }
        }
        return value;
      }

      // IPv6
      const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      if (ipv6Pattern.test(value)) {
        return value;
      }

      return helpers.error('string.ip', { value });
    };
  }

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

      return value;
    };
  }

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
    }
  ): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      if (value.length < minLength) {
        return helpers.error('string.passwordStrength', { value, minLength });
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

      return value;
    };
  }

  /**
   * 验证日期范围
   */
  static dateRange(minDate?: Date, maxDate?: Date): Joi.CustomValidator<string> {
    return (value: string, helpers: Joi.CustomHelpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error('string.dateRange', { value });
      }

      if (minDate && date < minDate) {
        return helpers.error('string.dateRange.min', { value, minDate });
      }
      if (maxDate && date > maxDate) {
        return helpers.error('string.dateRange.max', { value, maxDate });
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
        JSON.parse(value);
        return value;
      } catch {
        return helpers.error('string.json', { value });
      }
    };
  }

  /**
   * 验证是否为空值
   */
  static notEmpty(): Joi.CustomValidator<any> {
    return (value: any, helpers: Joi.CustomHelpers) => {
      if (value === null || value === undefined || value === '') {
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
   * 验证数值范围
   */
  static numericRange(
    min?: number,
    max?: number,
    options?: { integer?: boolean; precision?: number }
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

      if (min !== undefined && value < min) {
        return helpers.error('number.numericRange.min', { value, min });
      }
      if (max !== undefined && value > max) {
        return helpers.error('number.numericRange.max', { value, max });
      }

      return value;
    };
  }

  /**
   * 验证数组唯一性
   */
  static uniqueArray(): Joi.CustomValidator<any[]> {
    return (value: any[], helpers: Joi.CustomHelpers) => {
      if (!Array.isArray(value)) {
        return helpers.error('array.uniqueArray', { value });
      }
      const unique = new Set(value);
      if (unique.size !== value.length) {
        return helpers.error('array.uniqueArray', { value });
      }
      return value;
    };
  }
}

/**
 * 扩展Joi自定义验证器
 */
export function extendJoiWithCustomValidators(): void {
  const customValidators = CustomValidators;

  Joi.extend((joi) => ({
    type: 'idCard',
    base: joi.string(),
    messages: {
      'string.idCard': '{{#label}} 不是有效的身份证号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return customValidators.idCard()(value, helpers);
    },
  }));

  Joi.extend((joi) => ({
    type: 'phoneCN',
    base: joi.string(),
    messages: {
      'string.phoneCN': '{{#label}} 不是有效的手机号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return customValidators.phoneCN()(value, helpers);
    },
  }));

  Joi.extend((joi) => ({
    type: 'socialCreditCode',
    base: joi.string(),
    messages: {
      'string.socialCreditCode': '{{#label}} 不是有效的统一社会信用代码',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return customValidators.socialCreditCode()(value, helpers);
    },
  }));

  Joi.extend((joi) => ({
    type: 'creditCard',
    base: joi.string(),
    messages: {
      'string.creditCard': '{{#label}} 不是有效的信用卡号',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return customValidators.creditCard()(value, helpers);
    },
  }));

  Joi.extend((joi) => ({
    type: 'passwordStrength',
    base: joi.string(),
    messages: {
      'string.passwordStrength': '{{#label}} 密码强度不足',
      'string.passwordStrength.uppercase': '{{#label}} 密码需要包含大写字母',
      'string.passwordStrength.lowercase': '{{#label}} 密码需要包含小写字母',
      'string.passwordStrength.number': '{{#label}} 密码需要包含数字',
      'string.passwordStrength.special': '{{#label}} 密码需要包含特殊字符',
    },
    validate: (value: string, helpers: Joi.CustomHelpers) => {
      return customValidators.passwordStrength(8, {
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: false,
      })(value, helpers);
    },
  }));

  Joi.extend((joi) => ({
    type: 'notEmpty',
    base: joi.any(),
    messages: {
      'any.notEmpty': '{{#label}} 不能为空',
    },
    validate: (value: any, helpers: Joi.CustomHelpers) => {
      return customValidators.notEmpty()(value, helpers);
    },
  }));
}

export default CustomValidators;