/**
 * 服务层统一导出
 * 提供所有业务逻辑服务的集中管理
 */

export { BaseService } from './BaseService';
export { CustomerService } from './Customer.service';
export { FinanceService } from './Finance.service';
export { HRService } from './HR.service';
export { InventoryService } from './Inventory.service';
export { OrderService } from './Order.service';
export { ProductService } from './Product.service';
export { SettingsService } from './Settings.service';

export class ServiceFactory {
    private static instances: Map<string, any> = new Map();

    public static getService<T>(ServiceClass: new (...args: any[]) => T): T {
        const key = ServiceClass.name;
        if (!this.instances.has(key)) {
            this.instances.set(key, new ServiceClass());
        }
        return this.instances.get(key) as T;
    }

    public static clearInstances(): void {
        this.instances.clear();
    }
}

export default {
    BaseService,
    CustomerService,
    FinanceService,
    HRService,
    InventoryService,
    OrderService,
    ProductService,
    SettingsService,
    ServiceFactory
};
