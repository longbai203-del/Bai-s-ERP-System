/**
 * @file jest.config.js
 * Jest 测试框架配置 - 单元测试和集成测试
 */

module.exports = {
    // 预设配置
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    // 根目录
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    
    // 测试文件匹配
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    
    // 转换规则
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    
    // 模块路径映射
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
      '^@models/(.*)$': '<rootDir>/src/models/$1',
      '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
      '^@routes/(.*)$': '<rootDir>/src/routes/$1',
      '^@services/(.*)$': '<rootDir>/src/services/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
      '^@types/(.*)$': '<rootDir>/src/types/$1',
      '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    },
    
    // 覆盖率配置
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/**/index.ts',
      '!src/server.ts',
      '!src/**/__tests__/**',
      '!src/**/*.test.ts',
      '!src/**/*.spec.ts',
    ],
    
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    
    // 覆盖率报告格式
    coverageReporters: [
      'text',
      'text-summary',
      'html',
      'lcov',
      'json-summary',
    ],
    
    // 测试设置文件
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    
    // 全局变量
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
        diagnostics: false,
      },
    },
    
    // 测试超时
    testTimeout: 30000,
    
    // 并发运行
    maxWorkers: '50%',
    
    // 详细输出
    verbose: true,
    
    // 强制退出
    forceExit: true,
    
    // 测试环境变量
    testEnvironmentOptions: {
      NODE_ENV: 'test',
    },
  };