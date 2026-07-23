// 验证手机号
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

// 验证邮箱
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// 验证身份证
export function isValidIdCard(id: string): boolean {
  return /^\d{17}[\dXx]$/.test(id);
}

// 验证银行卡
export function isValidBankCard(card: string): boolean {
  return /^\d{16,19}$/.test(card);
}

// 验证URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 验证密码强度
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

// 验证是否为中文
export function isValidChinese(text: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(text);
}

// 验证是否为数字
export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// 验证是否为整数
export function isValidInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

// 验证是否为正数
export function isValidPositive(value: any): boolean {
  return isValidNumber(value) && Number(value) > 0;
}
