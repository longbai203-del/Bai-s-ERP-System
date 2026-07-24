import { BaseService } from './BaseService';
import { OrderRepository } from '../repositories/Order.repository';
import { generateCode } from '../utils';

export class OrderService extends BaseService<any> {
  private orderRepository: OrderRepository;
  
  constructor() {
    super(new OrderRepository());
    this.orderRepository = new OrderRepository();
  }

  async createOrder(data: any): Promise<any> {
    data.orderNo = generateCode('ORD');
    
    if (data.items && Array.isArray(data.items)) {
      data.totalAmount = data.items.reduce((sum: number, item: any) => sum + item.total, 0);
      data.finalAmount = data.totalAmount - (data.discount || 0) + (data.tax || 0);
    }
    
    return this.create(data);
  }

  async findByOrderNo(orderNo: string): Promise<any | null> {
    if (!orderNo) return null;
    return this.orderRepository.findByOrderNo(orderNo);
  }

  async findByCustomer(customerId: string): Promise<any[]> {
    if (!customerId) return [];
    return this.orderRepository.findByCustomer(customerId);
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.orderRepository.findByStatus(status);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) return [];
    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  async updateStatus(id: string, status: string): Promise<any | null> {
    this.validateId(id);
    if (!status) throw new Error('Status is required');
    return this.update(id, { status });
  }

  async cancelOrder(id: string, reason: string): Promise<any | null> {
    this.validateId(id);
    return this.update(id, {
      status: 'cancelled',
      notes: reason
    });
  }

  async getStatistics(): Promise<any> {
    return this.orderRepository.getStatistics();
  }
}
