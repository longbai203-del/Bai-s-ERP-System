export * from './base.service';
export * from './inventory.service';
export * from './order.service';
export * from './customer.service';
export * from './product.service';
export * from './finance.service';
export * from './hr.service';

// 统一导出所有服务实例
export { inventoryService } from './inventory.service';
export { orderService } from './order.service';
export { customerService } from './customer.service';
export { productService } from './product.service';
export { transactionService, accountService } from './finance.service';
export { employeeService, attendanceService, leaveService } from './hr.service';
