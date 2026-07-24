/**
 * @file tests/setup.ts
 * Jest 测试环境设置
 */

import dotenv from 'dotenv';
import path from 'path';

// 加载测试环境变量
dotenv.config({ path: path.join(__dirname, '../.env.test') });

// 增加测试超时时间
jest.setTimeout(30000);

// 模拟日志输出（避免测试时产生噪音）
jest.mock('../Config/winston.config', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  },
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  })),
}));

// 全局清理
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
});