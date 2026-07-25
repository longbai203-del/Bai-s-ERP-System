/**
 * 种子数据管理器
 * 统一管理所有种子数据
 * @module seeders/index
 */

import { Db } from 'mongodb';
import CustomersSeeder from './customers.seeder';
import EmployeesSeeder from './employees.seeder';
import OrdersSeeder from './orders.seeder';
import ProductsSeeder from './products.seeder';
import SettingsSeeder from './settings.seeder';

/**
 * 种子配置接口
 */
export interface SeederConfig {
  customers?: number;
  employees?: number;
  orders?: number;
  products?: number;
  settings?: boolean;
}

/**
 * 种子结果接口
 */
export interface SeederResult {
  customers: number;
  employees: number;
  orders: number;
  products: number;
  settings: number;
}

/**
 * 种子数据管理器
 */
export class SeederManager {
  private static instance: SeederManager;
  private config: SeederConfig = {
    customers: 100,
    employees: 50,
    orders: 200,
    products: 100,
    settings: true,
  };

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): SeederManager {
    if (!SeederManager.instance) {
      SeederManager.instance = new SeederManager();
    }
    return SeederManager.instance;
  }

  /**
   * 设置配置
   */
  setConfig(config: Partial<SeederConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取配置
   */
  getConfig(): SeederConfig {
    return { ...this.config };
  }

  /**
   * 执行所有种子数据
   */
  async seedAll(db: Db): Promise<SeederResult> {
    console.log('[SeederManager] 开始生成所有种子数据...');

    const result: SeederResult = {
      customers: 0,
      employees: 0,
      orders: 0,
      products: 0,
      settings: 0,
    };

    // 按顺序执行（先有客户和产品，才能生成订单）
    try {
      // 1. 客户
      result.customers = await CustomersSeeder.getInstance().seed(db, this.config.customers);
      console.log(`[SeederManager] 客户数据完成: ${result.customers}`);

      // 2. 产品
      result.products = await ProductsSeeder.getInstance().seed(db, this.config.products);
      console.log(`[SeederManager] 产品数据完成: ${result.products}`);

      // 3. 员工
      result.employees = await EmployeesSeeder.getInstance().seed(db, this.config.employees);
      console.log(`[SeederManager] 员工数据完成: ${result.employees}`);

      // 4. 订单（依赖客户和产品数据）
      result.orders = await OrdersSeeder.getInstance().seed(db, this.config.orders);
      console.log(`[SeederManager] 订单数据完成: ${result.orders}`);

      // 5. 设置
      if (this.config.settings) {
        result.settings = await SettingsSeeder.getInstance().seed(db);
        console.log(`[SeederManager] 设置数据完成: ${result.settings}`);
      }

      console.log('[SeederManager] 所有种子数据生成完成');
    } catch (error) {
      console.error('[SeederManager] 种子数据生成失败:', error);
      throw error;
    }

    return result;
  }

  /**
   * 清空所有数据
   */
  async clearAll(db: Db): Promise<SeederResult> {
    console.log('[SeederManager] 开始清空所有种子数据...');

    const result: SeederResult = {
      customers: 0,
      employees: 0,
      orders: 0,
      products: 0,
      settings: 0,
    };

    try {
      // 按相反顺序清空
      if (this.config.settings) {
        result.settings = await SettingsSeeder.getInstance().clear(db);
      }
      result.orders = await OrdersSeeder.getInstance().clear(db);
      result.products = await ProductsSeeder.getInstance().clear(db);
      result.employees = await EmployeesSeeder.getInstance().clear(db);
      result.customers = await CustomersSeeder.getInstance().clear(db);

      console.log('[SeederManager] 所有种子数据清空完成');
    } catch (error) {
      console.error('[SeederManager] 种子数据清空失败:', error);
      throw error;
    }

    return result;
  }

  /**
   * 清空并重新生成所有数据
   */
  async reseedAll(db: Db): Promise<SeederResult> {
    console.log('[SeederManager] 开始重新生成所有种子数据...');
    await this.clearAll(db);
    return this.seedAll(db);
  }

  /**
   * 执行特定种子数据
   */
  async seedSpecific(db: Db, type: string, count?: number): Promise<number> {
    console.log(`[SeederManager] 开始生成 ${type} 种子数据...`);

    switch (type) {
      case 'customers':
        return CustomersSeeder.getInstance().seed(db, count || this.config.customers);
      case 'employees':
        return EmployeesSeeder.getInstance().seed(db, count || this.config.employees);
      case 'orders':
        return OrdersSeeder.getInstance().seed(db, count || this.config.orders);
      case 'products':
        return ProductsSeeder.getInstance().seed(db, count || this.config.products);
      case 'settings':
        return SettingsSeeder.getInstance().seed(db);
      default:
        throw new Error(`未知的种子类型: ${type}`);
    }
  }
}

/**
 * 执行所有种子数据（便捷函数）
 */
export async function seedAll(db: Db, config?: Partial<SeederConfig>): Promise<SeederResult> {
  const manager = SeederManager.getInstance();
  if (config) {
    manager.setConfig(config);
  }
  return manager.seedAll(db);
}

/**
 * 清空所有数据（便捷函数）
 */
export async function clearAll(db: Db): Promise<SeederResult> {
  const manager = SeederManager.getInstance();
  return manager.clearAll(db);
}

/**
 * 重新生成所有数据（便捷函数）
 */
export async function reseedAll(db: Db): Promise<SeederResult> {
  const manager = SeederManager.getInstance();
  return manager.reseedAll(db);
}

export default SeederManager;