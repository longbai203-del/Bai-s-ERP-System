/**
 * 数据仓库层统一导出
 * 提供所有数据访问接口的集中管理
 */

export { BaseRepository } from './BaseRepository';
export { CustomerRepository } from './Customer.repository';
export { FinanceRepository } from './Finance.repository';
export { HRRepository } from './HR.repository';
export { InventoryRepository } from './Inventory.repository';
export { OrderRepository } from './Order.repository';
export { ProductRepository } from './Product.repository';
export { SettingsRepository } from './Settings.repository';

export class RepositoryFactory {
    private static instances: Map<string, any> = new Map();

    public static getRepository<T>(RepositoryClass: new () => T): T {
        const key = RepositoryClass.name;
        if (!this.instances.has(key)) {
            this.instances.set(key, new RepositoryClass());
        }
        return this.instances.get(key) as T;
    }

    public static clearInstances(): void {
        this.instances.clear();
    }
}

export default {
    BaseRepository,
    CustomerRepository,
    FinanceRepository,
    HRRepository,
    InventoryRepository,
    OrderRepository,
    ProductRepository,
    SettingsRepository,
    RepositoryFactory
};
