import { BaseService } from './BaseService';
import { OrderRepository } from '../repositories/Order.repository';
import { IOrder } from '../models/Order.model';
import { generateCode } from '../utils';

export class OrderService extends BaseService<IOrder> {
  private orderRepository: OrderRepository;
  
  constructor() {
    super(new OrderRepository());
    this.orderRepository = new OrderRepository();
  }
  
  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    data.orderNo = generateCode('ORD');
    if (data.items) {
      data.totalAmount = data.items.reduce((sum, item) => sum + item.total, 0);
      data.finalAmount = data.totalAmount - (data.discount || 0) + (data.tax || 0);
    }
    return this.repository.create(data);
  }
  
  async findByOrderNo(orderNo: string): Promise<IOrder | null> {
    return this.orderRepository.findByOrderNo(orderNo);
  }
  
  async findByCustomer(customerId: string): Promise<IOrder[]> {
    return this.orderRepository.findByCustomer(customerId);
  }
  
  async findByStatus(status: string): Promise<IOrder[]> {
    return this.orderRepository.findByStatus(status);
  }
  
  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    return this.repository.update(id, { status, updatedAt: new Date() });
  }
  
  async cancelOrder(id: string, reason: string): Promise<IOrder | null> {
    return this.repository.update(id, { 
      status: 'cancelled', 
      notes: reason,
      updatedAt: new Date() 
    });
  }
  
  async getOrderStatistics(): Promise<any> {
    return this.orderRepository.getStatistics();
  }
}
