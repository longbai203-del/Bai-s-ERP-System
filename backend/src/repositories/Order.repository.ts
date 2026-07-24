import { BaseRepository } from './BaseRepository';
import { OrderModel } from '../models/Order.model';

export class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(OrderModel);
  }

  async findByOrderNo(orderNo: string): Promise<any | null> {
    if (!orderNo) return null;
    return this.model.findOne({ orderNo });
  }

  async findByCustomer(customerId: string): Promise<any[]> {
    if (!customerId) return [];
    return this.model.find({ customerId }).sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.model.find({ status }).sort({ createdAt: -1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) return [];
    return this.model.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });
  }

  async getStatistics(): Promise<any> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          averageAmount: { $avg: '$finalAmount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          processingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);
    return result[0] || { totalOrders: 0, totalRevenue: 0, averageAmount: 0, pendingCount: 0, processingCount: 0, completedCount: 0, cancelledCount: 0 };
  }
}
