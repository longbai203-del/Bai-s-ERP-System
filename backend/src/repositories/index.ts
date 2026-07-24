/**
 * @file Repositories/index.ts
 * 仓储统一导出 - 所有仓储实例的单例管理
 */

import { dataSource } from '../Config/database';

// ============================================
// 导入所有仓储
// ============================================

import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { CustomerRepository, customerRepository } from './Customer.repository';
import { FinanceRepository, financeRepository } from './Finance.repository';
import { OrderRepository, orderRepository } from './Order.repository';
import { ProductRepository, productRepository } from './Product.repository';
import { SettingsRepository, settingsRepository } from './Settings.repository';

// HR 和 Inventory 仓储（假设存在）
// import { HRRepository, hrRepository } from './HR.repository';
// import { InventoryRepository, inventoryRepository } from './Inventory.repository';

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

// 如果 HR 和 Inventory 存在，取消注释
// export { hrRepository, inventoryRepository };

// ============================================
// 统一仓储对象
// ============================================

export const repositories = {
  customer: customerRepository,
  finance: financeRepository,
  order: orderRepository,
  product: productRepository,
  settings: settingsRepository,
  // hr: hrRepository,
  // inventory: inventoryRepository,
};

// ============================================
// 仓储工厂 - 统一管理仓储实例
// ============================================

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private repositoryMap: Map<string, any> = new Map();

  private constructor() {
    // 注册所有仓储
    this.repositoryMap.set('customer', customerRepository);
    this.repositoryMap.set('finance', financeRepository);
    this.repositoryMap.set('order', orderRepository);
    this.repositoryMap.set('product', productRepository);
    this.repositoryMap.set('settings', settingsRepository);
    // this.repositoryMap.set('hr', hrRepository);
    // this.repositoryMap.set('inventory', inventoryRepository);
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  /**
   * 获取仓储实例
   */
  getRepository<T>(name: string): T {
    const repo = this.repositoryMap.get(name);
    if (!repo) {
      throw new Error(`仓储 "${name}" 未注册`);
    }
    return repo as T;
  }

  /**
   * 获取所有已注册的仓储名称
   */
  getRepositoryNames(): string[] {
    return Array.from(this.repositoryMap.keys());
  }

  /**
   * 检查仓储是否已注册
   */
  hasRepository(name: string): boolean {
    return this.repositoryMap.has(name);
  }

  /**
   * 注册新仓储
   */
  registerRepository(name: string, repository: any): void {
    if (this.repositoryMap.has(name)) {
      throw new Error(`仓储 "${name}" 已存在`);
    }
    this.repositoryMap.set(name, repository);
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
  // hr: hrRepository,
  // inventory: inventoryRepository,
  factory: repositoryFactory,
};