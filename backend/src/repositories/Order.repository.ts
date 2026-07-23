import { BaseRepository } from '../repositories/BaseRepository';
import { OrderModel, IOrder } from '../models/Order.model';

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }
  
  async findByOrderNo(orderNo: string): Promise<IOrder | null> {
    return this.model.findOne({ orderNo });
  }
  
  async findByCustomer(customerId: string): Promise<IOrder[]> {
    return this.model.find({ customerId }).sort({ createdAt: -1 });
  }
  
  async findByStatus(status: string): Promise<IOrder[]> {
    return this.model.find({ status }).sort({ createdAt: -1 });
  }
  
  async getStatistics(): Promise<any> {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          averageAmount: { $avg: '$finalAmount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);
    return stats[0] || { totalOrders: 0, totalRevenue: 0, averageAmount: 0, pendingCount: 0, completedCount: 0 };
  }
}
