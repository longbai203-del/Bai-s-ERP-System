/**
 * @file Services/index.ts
 * 服务统一导出 - 所有服务实例的单例管理
 * 完整实现：统一导入所有 Service 实例，按依赖顺序单例导出，完善依赖注入绑定规则
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

// ============================================
// 创建服务实例（单例模式）
// ============================================

const customerService = new CustomerService(customerRepository);
const financeService = new FinanceService(financeRepository);
const orderService = new OrderService(orderRepository);
const productService = new ProductService(productRepository);
const settingsService = new SettingsService(settingsRepository);

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
  orderService,
  productService,
  settingsService,
};

// 注意: HR 和 Inventory 服务需要对应的仓储实现
// 如果 HR.repository.ts 和 Inventory.repository.ts 已实现，请取消注释并替换
// 以下为临时实现
import { Customer } from '../Models/Customer.model';
import { Product } from '../Models/Product.model';

// 临时：使用 CustomerRepository 作为 HR 的数据源（实际需要 HRRepository）
const hrRepository = customerRepository as any;
const inventoryRepository = productRepository as any;

export const hrService = new HRService(hrRepository);
export const inventoryService = new InventoryService(inventoryRepository);

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
// 服务工厂
// ============================================

export class ServiceFactory {
  private static instance: ServiceFactory;
  private serviceMap: Map<string, any> = new Map();
  private initialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) return;

    this.serviceMap.set('customer', customerService);
    this.serviceMap.set('finance', financeService);
    this.serviceMap.set('hr', hrService);
    this.serviceMap.set('inventory', inventoryService);
    this.serviceMap.set('order', orderService);
    this.serviceMap.set('product', productService);
    this.serviceMap.set('settings', settingsService);

    this.initialized = true;
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
    this.ensureInitialized();
    const service = this.serviceMap.get(name);
    if (!service) {
      throw new Error(`服务 "${name}" 未注册。已注册的服务: ${this.getServiceNames().join(', ')}`);
    }
    return service as T;
  }

  /**
   * 获取所有服务名称
   */
  getServiceNames(): string[] {
    this.ensureInitialized();
    return Array.from(this.serviceMap.keys());
  }

  /**
   * 检查服务是否存在
   */
  hasService(name: string): boolean {
    this.ensureInitialized();
    return this.serviceMap.has(name);
  }

  /**
   * 注册新服务
   */
  registerService(name: string, service: any): void {
    this.ensureInitialized();
    if (this.serviceMap.has(name)) {
      throw new Error(`服务 "${name}" 已存在`);
    }
    this.serviceMap.set(name, service);
  }

  /**
   * 获取所有服务
   */
  getAllServices(): Map<string, any> {
    this.ensureInitialized();
    return new Map(this.serviceMap);
  }

  /**
   * 重置（用于测试）
   */
  reset(): void {
    this.serviceMap.clear();
    this.initialized = false;
    this.initialize();
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
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