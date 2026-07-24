/**
 * @file Controllers/index.ts
 * 控制器统一导出 - 所有控制器实例的单例管理
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
// 控制器工厂 - 统一管理控制器实例
// ============================================

export class ControllerFactory {
  private static instance: ControllerFactory;
  private controllerMap: Map<string, any> = new Map();

  private constructor() {
    // 注册所有控制器
    this.controllerMap.set('customer', customerController);
    this.controllerMap.set('finance', financeController);
    this.controllerMap.set('hr', hrController);
    this.controllerMap.set('inventory', inventoryController);
    this.controllerMap.set('order', orderController);
    this.controllerMap.set('product', productController);
    this.controllerMap.set('settings', settingsController);
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
    const controller = this.controllerMap.get(name);
    if (!controller) {
      throw new Error(`控制器 "${name}" 未注册`);
    }
    return controller as T;
  }

  /**
   * 获取所有已注册的控制器名称
   */
  getControllerNames(): string[] {
    return Array.from(this.controllerMap.keys());
  }

  /**
   * 检查控制器是否已注册
   */
  hasController(name: string): boolean {
    return this.controllerMap.has(name);
  }

  /**
   * 注册新控制器
   */
  registerController(name: string, controller: any): void {
    if (this.controllerMap.has(name)) {
      throw new Error(`控制器 "${name}" 已存在`);
    }
    this.controllerMap.set(name, controller);
  }

  /**
   * 获取所有控制器
   */
  getAllControllers(): Map<string, any> {
    return new Map(this.controllerMap);
  }

  /**
   * 重置所有控制器（用于测试）
   */
  reset(): void {
    this.controllerMap.clear();
    // 重新注册
    this.controllerMap.set('customer', customerController);
    this.controllerMap.set('finance', financeController);
    this.controllerMap.set('hr', hrController);
    this.controllerMap.set('inventory', inventoryController);
    this.controllerMap.set('order', orderController);
    this.controllerMap.set('product', productController);
    this.controllerMap.set('settings', settingsController);
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