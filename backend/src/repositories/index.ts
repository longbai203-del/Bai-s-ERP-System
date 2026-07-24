/**
 * @file Repositories/index.ts
 * 仓储统一导出 - 所有仓储实例的单例管理
 * 完整实现：统一导入所有 Repository 实例，以单例模式统一导出
 */

import { dataSource } from '../Config/database';

// ============================================
// 导入基础类
// ============================================

import { BaseRepository } from './BaseRepository';
import type { PaginationOptions, PaginatedResult } from './BaseRepository';

// ============================================
// 导入所有仓储
// ============================================

import { CustomerRepository, customerRepository } from './Customer.repository';
import { FinanceRepository, financeRepository } from './Finance.repository';
import { OrderRepository, orderRepository } from './Order.repository';
import { ProductRepository, productRepository } from './Product.repository';
import { SettingsRepository, settingsRepository } from './Settings.repository';

// ============================================
// 导出基础类和类型
// ============================================

export { BaseRepository };
export type { PaginationOptions, PaginatedResult };

// ============================================
// 导出所有仓储实例（单例）
// ============================================

export {
  customerRepository,
  financeRepository,
  orderRepository,
  productRepository,
  settingsRepository,
};

// ============================================
// 统一仓储对象
// ============================================

export const repositories = {
  customer: customerRepository,
  finance: financeRepository,
  order: orderRepository,
  product: productRepository,
  settings: settingsRepository,
};

// ============================================
// 仓储工厂
// ============================================

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private repositoryMap: Map<string, any> = new Map();

  private constructor() {
    this.repositoryMap.set('customer', customerRepository);
    this.repositoryMap.set('finance', financeRepository);
    this.repositoryMap.set('order', orderRepository);
    this.repositoryMap.set('product', productRepository);
    this.repositoryMap.set('settings', settingsRepository);
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  getRepository<T>(name: string): T {
    const repo = this.repositoryMap.get(name);
    if (!repo) {
      throw new Error(`仓储 "${name}" 未注册`);
    }
    return repo as T;
  }

  getRepositoryNames(): string[] {
    return Array.from(this.repositoryMap.keys());
  }

  hasRepository(name: string): boolean {
    return this.repositoryMap.has(name);
  }

  registerRepository(name: string, repository: any): void {
    if (this.repositoryMap.has(name)) {
      throw new Error(`仓储 "${name}" 已存在`);
    }
    this.repositoryMap.set(name, repository);
  }

  getAllRepositories(): Map<string, any> {
    return new Map(this.repositoryMap);
  }

  reset(): void {
    this.repositoryMap.clear();
    this.repositoryMap.set('customer', customerRepository);
    this.repositoryMap.set('finance', financeRepository);
    this.repositoryMap.set('order', orderRepository);
    this.repositoryMap.set('product', productRepository);
    this.repositoryMap.set('settings', settingsRepository);
  }
}

// ============================================
// 导出仓储工厂单例
// ============================================

export const repositoryFactory = RepositoryFactory.getInstance();

// ============================================
// 默认导出
// ============================================

export default {
  customer: customerRepository,
  finance: financeRepository,
  order: orderRepository,
  product: productRepository,
  settings: settingsRepository,
  factory: repositoryFactory,
};