/**
 * 数据加密工具
 * 支持对称加密、非对称加密、哈希、密钥派生
 * @module encryption
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash, scrypt, createHmac, generateKeyPairSync } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * 加密算法
 */
export enum EncryptionAlgorithm {
  /** AES-256-GCM（推荐） */
  AES_256_GCM = 'aes-256-gcm',
  /** AES-256-CBC */
  AES_256_CBC = 'aes-256-cbc',
  /** AES-192-GCM */
  AES_192_GCM = 'aes-192-gcm',
  /** AES-192-CBC */
  AES_192_CBC = 'aes-192-cbc',
  /** AES-128-GCM */
  AES_128_GCM = 'aes-128-gcm',
  /** AES-128-CBC */
  AES_128_CBC = 'aes-128-cbc',
  /** ChaCha20-Poly1305 */
  CHACHA20_POLY1305 = 'chacha20-poly1305',
}

/**
 * 哈希算法
 */
export enum HashAlgorithm {
  SHA256 = 'sha256',
  SHA384 = 'sha384',
  SHA512 = 'sha512',
  SHA3_256 = 'sha3-256',
  SHA3_512 = 'sha3-512',
  BLAKE2b512 = 'blake2b512',
  BLAKE2s256 = 'blake2s256',
}

/**
 * 加密配置
 */
export interface EncryptionConfig {
  /** 加密算法 */
  algorithm?: EncryptionAlgorithm;
  /** 密钥长度（字节） */
  keyLength?: number;
  /** 密钥派生迭代次数 */
  iterations?: number;
  /** 盐长度（字节） */
  saltLength?: number;
  /** IV长度（字节） */
  ivLength?: number;
  /** 认证标签长度（字节） */
  authTagLength?: number;
  /** 是否使用密钥派生 */
  useKDF?: boolean;
  /** 密钥派生算法 */
  kdfAlgorithm?: 'pbkdf2' | 'scrypt' | 'bcrypt';
  /** PBKDF2迭代次数 */
  pbkdf2Iterations?: number;
  /** Scrypt参数 */
  scryptParams?: { N: number; r: number; p: number };
}

/**
 * 加密结果
 */
export interface EncryptResult {
  /** 加密数据（Base64） */
  data: string;
  /** IV（Base64） */
  iv: string;
  /** 盐（Base64） */
  salt?: string;
  /** 认证标签（Base64） */
  authTag?: string;
  /** 使用的算法 */
  algorithm: string;
}

/**
 * 加密工具类
 */
export class Encryption {
  private config: Required<EncryptionConfig>;
  private masterKey: Buffer | null = null;

  constructor(config: EncryptionConfig = {}) {
    this.config = {
      algorithm: EncryptionAlgorithm.AES_256_GCM,
      keyLength: 32,
      iterations: 100000,
      saltLength: 16,
      ivLength: 16,
      authTagLength: 16,
      useKDF: true,
      kdfAlgorithm: 'scrypt',
      pbkdf2Iterations: 100000,
      scryptParams: { N: 16384, r: 8, p: 1 },
      ...config,
    };
  }

  /**
   * 设置主密钥
   */
  setMasterKey(key: string | Buffer): void {
    if (typeof key === 'string') {
      this.masterKey = Buffer.from(key, 'base64');
    } else {
      this.masterKey = key;
    }
  }

  /**
   * 生成随机密钥
   */
  generateKey(length?: number): Buffer {
    const size = length || this.config.keyLength;
    return randomBytes(size);
  }

  /**
   * 派生密钥
   */
  async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    const { kdfAlgorithm, pbkdf2Iterations, scryptParams, keyLength } = this.config;

    switch (kdfAlgorithm) {
      case 'pbkdf2': {
        const { createHash } = await import('crypto');
        return new Promise((resolve, reject) => {
          const { pbkdf2 } = require('crypto');
          pbkdf2(password, salt, pbkdf2Iterations, keyLength, 'sha512', (err: any, derivedKey: Buffer) => {
            if (err) reject(err);
            else resolve(derivedKey);
          });
        });
      }
      case 'scrypt': {
        const { N, r, p } = scryptParams!;
        const derivedKey = await scryptAsync(password, salt, keyLength, { N, r, p }) as Buffer;
        return derivedKey;
      }
      default: {
        throw new Error(`不支持的KDF算法: ${kdfAlgorithm}`);
      }
    }
  }

  /**
   * 加密数据
   */
  async encrypt(data: string | Buffer, key?: Buffer | string): Promise<EncryptResult> {
    const algorithm = this.config.algorithm;
    const ivLength = this.config.ivLength;
    const saltLength = this.config.saltLength;
    const authTagLength = this.config.authTagLength;

    // 准备数据
    const plaintext = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

    // 获取密钥
    let encryptionKey: Buffer;
    let salt: Buffer | null = null;

    if (key) {
      if (typeof key === 'string') {
        encryptionKey = Buffer.from(key, 'base64');
      } else {
        encryptionKey = key;
      }
    } else if (this.masterKey) {
      encryptionKey = this.masterKey;
    } else {
      throw new Error('未设置加密密钥');
    }

    // 使用KDF派生密钥
    let derivedKey = encryptionKey;
    if (this.config.useKDF) {
      salt = randomBytes(saltLength);
      derivedKey = await this.deriveKey(encryptionKey.toString('hex'), salt);
    }

    // 生成IV
    const iv = randomBytes(ivLength);

    // 创建加密器
    let cipher: any;
    let authTag: Buffer | null = null;

    try {
      if (algorithm.includes('gcm') || algorithm === EncryptionAlgorithm.CHACHA20_POLY1305) {
        cipher = createCipheriv(algorithm, derivedKey, iv, { authTagLength });
      } else {
        cipher = createCipheriv(algorithm, derivedKey, iv);
      }
    } catch (error) {
      throw new Error(`创建加密器失败: ${error}`);
    }

    // 加密数据
    const encrypted = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);

    // 获取认证标签
    if ('getAuthTag' in cipher) {
      authTag = cipher.getAuthTag() as Buffer;
    }

    return {
      data: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      salt: salt ? salt.toString('base64') : undefined,
      authTag: authTag ? authTag.toString('base64') : undefined,
      algorithm,
    };
  }

  /**
   * 解密数据
   */
  async decrypt(encryptedData: EncryptResult, key?: Buffer | string): Promise<Buffer> {
    const { data, iv, salt, authTag, algorithm } = encryptedData;
    const ivBuffer = Buffer.from(iv, 'base64');

    // 获取密钥
    let encryptionKey: Buffer;
    if (key) {
      if (typeof key === 'string') {
        encryptionKey = Buffer.from(key, 'base64');
      } else {
        encryptionKey = key;
      }
    } else if (this.masterKey) {
      encryptionKey = this.masterKey;
    } else {
      throw new Error('未设置解密密钥');
    }

    // 使用KDF派生密钥
    let derivedKey = encryptionKey;
    if (this.config.useKDF && salt) {
      const saltBuffer = Buffer.from(salt, 'base64');
      derivedKey = await this.deriveKey(encryptionKey.toString('hex'), saltBuffer);
    }

    // 创建解密器
    let decipher: any;

    try {
      if (algorithm.includes('gcm') || algorithm === EncryptionAlgorithm.CHACHA20_POLY1305) {
        if (!authTag) {
          throw new Error('GCM模式需要认证标签');
        }
        const authTagBuffer = Buffer.from(authTag, 'base64');
        decipher = createDecipheriv(algorithm, derivedKey, ivBuffer);
        decipher.setAuthTag(authTagBuffer);
      } else {
        decipher = createDecipheriv(algorithm, derivedKey, ivBuffer);
      }
    } catch (error) {
      throw new Error(`创建解密器失败: ${error}`);
    }

    try {
      const encryptedBuffer = Buffer.from(data, 'base64');
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ]);
      return decrypted;
    } catch (error) {
      throw new Error(`解密失败: ${error}`);
    }
  }

  /**
   * 哈希数据
   */
  hash(data: string | Buffer, algorithm: HashAlgorithm = HashAlgorithm.SHA256): string {
    const hash = createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
  }

  /**
   * HMAC签名
   */
  hmac(data: string | Buffer, secret: string | Buffer, algorithm: HashAlgorithm = HashAlgorithm.SHA256): string {
    const hmac = createHmac(algorithm, secret);
    hmac.update(data);
    return hmac.digest('hex');
  }

  /**
   * 验证HMAC签名
   */
  verifyHmac(data: string | Buffer, signature: string, secret: string | Buffer): boolean {
    const expected = this.hmac(data, secret);
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  /**
   * 生成RSA密钥对
   */
  generateRSAKeyPair(modulusLength: number = 2048): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    return { publicKey, privateKey };
  }

  /**
   * 使用公钥加密（RSA）
   */
  encryptRSA(data: string | Buffer, publicKey: string): string {
    const { publicEncrypt } = require('crypto');
    const encrypted = publicEncrypt(publicKey, Buffer.from(data));
    return encrypted.toString('base64');
  }

  /**
   * 使用私钥解密（RSA）
   */
  decryptRSA(encryptedData: string, privateKey: string): Buffer {
    const { privateDecrypt } = require('crypto');
    const encrypted = Buffer.from(encryptedData, 'base64');
    return privateDecrypt(privateKey, encrypted);
  }

  /**
   * 生成安全随机字符串
   */
  randomString(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * 生成安全随机数字
   */
  randomNumber(min: number, max: number): number {
    const range = max - min;
    const bytes = Math.ceil(Math.log2(range) / 8);
    const buffer = randomBytes(bytes);
    const value = parseInt(buffer.toString('hex'), 16);
    return min + (value % range);
  }

  /**
   * 时安全比较
   */
  timingSafeEqual(a: string | Buffer, b: string | Buffer): boolean {
    if (typeof a === 'string') a = Buffer.from(a);
    if (typeof b === 'string') b = Buffer.from(b);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  /**
   * 获取配置
   */
  getConfig(): EncryptionConfig {
    return { ...this.config };
  }
}

/**
 * 创建加密工具实例（工厂函数）
 */
export function createEncryption(config?: EncryptionConfig): Encryption {
  return new Encryption(config);
}

/**
 * 默认加密工具实例
 */
export const defaultEncryption = new Encryption();

export default Encryption;