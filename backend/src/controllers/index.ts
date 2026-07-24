/**
 * @file Controllers/index.ts
 * 控制器统一导出 - 所有控制器实例的单例管理
 * 完整实现：统一导入所有 Controller 实例，完整导出所有控制器，补充路由注册关联配置
 */

// ============================================
// 导入所有控制器
// ============================================

import { BaseController } from './BaseController';
import { CustomerController } from './Customer.controller';
import { FinanceController } from './Finance.controller';
import { HRController } from './HR.controller';
import { InventoryController } from './Inventory.controller';
import { OrderController } from './Order.controller';
import { ProductController } from './Product.controller';
import { SettingsController } from './Settings.controller';

// ============================================
// 导入服务依赖
// ============================================

import {
  customerService,
  financeService,
  hrService,
  inventoryService,
  orderService,
  productService,
  settingsService,
} from '../Services';

// ============================================
// 创建控制器实例（依赖注入）
// ============================================

const customerController = new CustomerController(customerService);
const financeController = new FinanceController(financeService);
const hrController = new HRController(hrService);
const inventoryController = new InventoryController(inventoryService);
const orderController = new OrderController(orderService);
const productController = new ProductController(productService);
const settingsController = new SettingsController(settingsService);

// ============================================
// 导出基础控制器类
// ============================================

export { BaseController };

// ============================================
// 导出所有控制器实例
// ============================================

export {
  customerController,
  financeController,
  hrController,
  inventoryController,
  orderController,
  productController,
  settingsController,
};

// ============================================
// 统一控制器对象
// ============================================

export const controllers = {
  customer: customerController,
  finance: financeController,
  hr: hrController,
  inventory: inventoryController,
  order: orderController,
  product: productController,
  settings: settingsController,
};

// ============================================
// 控制器工厂
// ============================================

export class ControllerFactory {
  private static instance: ControllerFactory;
  private controllerMap: Map<string, any> = new Map();
  private initialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) return;

    this.controllerMap.set('customer', customerController);
    this.controllerMap.set('finance', financeController);
    this.controllerMap.set('hr', hrController);
    this.controllerMap.set('inventory', inventoryController);
    this.controllerMap.set('order', orderController);
    this.controllerMap.set('product', productController);
    this.controllerMap.set('settings', settingsController);

    this.initialized = true;
  }

  static getInstance(): ControllerFactory {
    if (!ControllerFactory.instance) {
      ControllerFactory.instance = new ControllerFactory();
    }
    return ControllerFactory.instance;
  }

  /**
   * 获取控制器实例
   */
  getController<T>(name: string): T {
    this.ensureInitialized();
    const controller = this.controllerMap.get(name);
    if (!controller) {
      throw new Error(`控制器 "${name}" 未注册。已注册的控制器: ${this.getControllerNames().join(', ')}`);
    }
    return controller as T;
  }

  /**
   * 获取所有控制器名称
   */
  getControllerNames(): string[] {
    this.ensureInitialized();
    return Array.from(this.controllerMap.keys());
  }

  /**
   * 检查控制器是否存在
   */
  hasController(name: string): boolean {
    this.ensureInitialized();
    return this.controllerMap.has(name);
  }

  /**
   * 注册新控制器
   */
  registerController(name: string, controller: any): void {
    this.ensureInitialized();
    if (this.controllerMap.has(name)) {
      throw new Error(`控制器 "${name}" 已存在`);
    }
    this.controllerMap.set(name, controller);
  }

  /**
   * 获取所有控制器
   */
  getAllControllers(): Map<string, any> {
    this.ensureInitialized();
    return new Map(this.controllerMap);
  }

  /**
   * 获取控制器路由绑定配置
   */
  getControllerRouteConfig(): Record<string, string> {
    this.ensureInitialized();
    const config: Record<string, string> = {};
    for (const [name] of this.controllerMap) {
      config[name] = `/api/v1/${name}s`;
    }
    return config;
  }

  /**
   * 重置（用于测试）
   */
  reset(): void {
    this.controllerMap.clear();
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
// 导出控制器工厂单例
// ============================================

export const controllerFactory = ControllerFactory.getInstance();

// ============================================
// 默认导出
// ============================================

export default {
  customer: customerController,
  finance: financeController,
  hr: hrController,
  inventory: inventoryController,
  order: orderController,
  product: productController,
  settings: settingsController,
  factory: controllerFactory,
};