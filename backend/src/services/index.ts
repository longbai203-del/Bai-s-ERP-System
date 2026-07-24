/**
 * @file Services/index.ts
 * 服务统一导出 - 所有服务实例的单例管理
 */

// ============================================
// 导入所有服务
// ============================================

import { BaseService } from './BaseService';
import { CustomerService } from './Customer.service';
import { FinanceService } from './Finance.service';
import { HRService } from './HR.service';
import { InventoryService } from './Inventory.service';
import { OrderService } from './Order.service';
import { ProductService } from './Product.service';
import { SettingsService } from './Settings.service';

// ============================================
// 导入仓储依赖
// ============================================

import {
  customerRepository,
  financeRepository,
  orderRepository,
  productRepository,
  settingsRepository,
} from '../Repositories';

// 假设 HR 和 Inventory 仓储存在
// import { hrRepository, inventoryRepository } from '../Repositories';

// ============================================
// 创建服务实例（单例模式）
// ============================================

const customerService = new CustomerService(customerRepository);
const financeService = new FinanceService(financeRepository);
const orderService = new OrderService(orderRepository);
const productService = new ProductService(productRepository);
const settingsService = new SettingsService(settingsRepository);

// 如果 HR 和 Inventory 仓储存在，取消注释
// const hrService = new HRService(hrRepository);
// const inventoryService = new InventoryService(inventoryRepository);

// 临时使用基础服务
const hrService = new HRService(customerRepository as any);
const inventoryService = new InventoryService(productRepository as any);

// ============================================
// 导出基础服务类
// ============================================

export { BaseService };

// ============================================
// 导出所有服务实例
// ============================================

export {
  customerService,
  financeService,
  hrService,
  inventoryService,
  orderService,
  productService,
  settingsService,
};

// ============================================
// 统一服务对象
// ============================================

export const services = {
  customer: customerService,
  finance: financeService,
  hr: hrService,
  inventory: inventoryService,
  order: orderService,
  product: productService,
  settings: settingsService,
};

// ============================================
// 服务工厂 - 统一管理服务实例
// ============================================

export class ServiceFactory {
  private static instance: ServiceFactory;
  private serviceMap: Map<string, any> = new Map();

  private constructor() {
    // 注册所有服务
    this.serviceMap.set('customer', customerService);
    this.serviceMap.set('finance', financeService);
    this.serviceMap.set('hr', hrService);
    this.serviceMap.set('inventory', inventoryService);
    this.serviceMap.set('order', orderService);
    this.serviceMap.set('product', productService);
    this.serviceMap.set('settings', settingsService);
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  /**
   * 获取服务实例
   */
  getService<T>(name: string): T {
    const service = this.serviceMap.get(name);
    if (!service) {
      throw new Error(`服务 "${name}" 未注册`);
    }
    return service as T;
  }

  /**
   * 获取所有已注册的服务名称
   */
  getServiceNames(): string[] {
    return Array.from(this.serviceMap.keys());
  }

  /**
   * 检查服务是否已注册
   */
  hasService(name: string): boolean {
    return this.serviceMap.has(name);
  }

  /**
   * 注册新服务
   */
  registerService(name: string, service: any): void {
    if (this.serviceMap.has(name)) {
      throw new Error(`服务 "${name}" 已存在`);
    }
    this.serviceMap.set(name, service);
  }

  /**
   * 获取所有服务
   */
  getAllServices(): Map<string, any> {
    return new Map(this.serviceMap);
  }
}

// ============================================
// 导出服务工厂单例
// ============================================

export const serviceFactory = ServiceFactory.getInstance();

// ============================================
// 默认导出
// ============================================

export default {
  customer: customerService,
  finance: financeService,
  hr: hrService,
  inventory: inventoryService,
  order: orderService,
  product: productService,
  settings: settingsService,
  factory: serviceFactory,
};