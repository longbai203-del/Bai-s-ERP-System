/**
 * 控制器层统一导出
 * 提供所有HTTP控制器的集中管理
 */

export { BaseController } from './BaseController';
export { CustomerController } from './Customer.controller';
export { FinanceController } from './Finance.controller';
export { HRController } from './HR.controller';
export { InventoryController } from './Inventory.controller';
export { OrderController } from './Order.controller';
export { ProductController } from './Product.controller';
export { SettingsController } from './Settings.controller';

export class ControllerFactory {
    private static instances: Map<string, any> = new Map();

    public static getController<T>(ControllerClass: new (...args: any[]) => T): T {
        const key = ControllerClass.name;
        if (!this.instances.has(key)) {
            this.instances.set(key, new ControllerClass());
        }
        return this.instances.get(key) as T;
    }

    public static clearInstances(): void {
        this.instances.clear();
    }
}

export default {
    BaseController,
    CustomerController,
    FinanceController,
    HRController,
    InventoryController,
    OrderController,
    ProductController,
    SettingsController,
    ControllerFactory
};
