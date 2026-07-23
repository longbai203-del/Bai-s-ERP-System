import crypto from 'crypto';

export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateCode = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

export const sanitize = (obj: any): any => {
  const sanitized = { ...obj };
  delete sanitized.password;
  delete sanitized.__v;
  return sanitized;
};

export const formatResponse = (code: number, data: any, message: string) => {
  return { code, data, message };
};
