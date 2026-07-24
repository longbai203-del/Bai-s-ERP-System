/**
 * @file Repositories/Order.repository.ts
 * 订单仓储 - 订单数据访问层
 */

import { Repository, DataSource, Like, In, Between, FindOptionsWhere } from 'typeorm';
import { Order } from '../Models/Order.model';
import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { logger } from '../Config/winston.config';
import dataSource from '../Config/database';

export interface OrderFilters {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
}

export class OrderRepository extends BaseRepository<Order> {
  private orderRepository: Repository<Order>;

  constructor(dataSource: DataSource) {
    super(dataSource, Order);
    this.orderRepository = dataSource.getRepository(Order);
  }

  /**
   * 根据客户ID查找订单
   */
  async findByCustomerId(customerId: number): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { customerId },
        order: { orderDate: 'DESC' },
        relations: ['items', 'items.product'],
      });
    } catch (error) {
      logger.error('[OrderRepository] 根据客户ID查找订单失败', { customerId, error });
      throw error;
    }
  }

  /**
   * 分页查询订单
   */
  async searchOrders(
    filters: OrderFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Order>> {
    try {
      const where: FindOptionsWhere<Order> = {};

      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.customerId) {
        where.customerId = filters.customerId;
      }
      if (filters.dateFrom || filters.dateTo) {
        const dateRange: any = {};
        if (filters.dateFrom) {
          dateRange.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          dateRange.lte = filters.dateTo;
        }
        where.orderDate = dateRange;
      }
      if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        const amountRange: any = {};
        if (filters.minAmount !== undefined) {
          amountRange.gte = filters.minAmount;
        }
        if (filters.maxAmount !== undefined) {
          amountRange.lte = filters.maxAmount;
        }
        where.totalAmount = amountRange;
      }
      if (filters.keyword) {
        // 使用 OR 条件搜索订单号或客户信息
        // 这里简化处理
        return await this.findWithPagination(pagination, where, ['customer', 'items']);
      }

      return await this.findWithPagination(pagination, where, ['customer', 'items']);
    } catch (error) {
      logger.error('[OrderRepository] 搜索订单失败', { filters, error });
      throw error;
    }
  }

  /**
   * 获取订单统计信息
   */
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }> {
    try {
      const stats = await this.orderRepository
        .createQueryBuilder('order')
        .select([
          'COUNT(*) as totalOrders',
          'SUM(totalAmount) as totalRevenue',
          'AVG(totalAmount) as averageOrderValue',
          'SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pendingOrders',
          'SUM(CASE WHEN status = "shipped" THEN 1 ELSE 0 END) as shippedOrders',
          'SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as deliveredOrders',
          'SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelledOrders',
        ])
        .getRawOne();

      return {
        totalOrders: parseInt(stats.totalOrders, 10) || 0,
        totalRevenue: parseFloat(stats.totalRevenue) || 0,
        averageOrderValue: parseFloat(stats.averageOrderValue) || 0,
        pendingOrders: parseInt(stats.pendingOrders, 10) || 0,
        shippedOrders: parseInt(stats.shippedOrders, 10) || 0,
        deliveredOrders: parseInt(stats.deliveredOrders, 10) || 0,
        cancelledOrders: parseInt(stats.cancelledOrders, 10) || 0,
      };
    } catch (error) {
      logger.error('[OrderRepository] 获取订单统计失败', { error });
      throw error;
    }
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(id: number, status: Order['status'], reason?: string): Promise<boolean> {
    try {
      const result = await this.orderRepository.update(
        { id },
        { status, updatedAt: new Date() }
      );
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error('[OrderRepository] 更新订单状态失败', { id, status, error });
      throw error;
    }
  }

  /**
   * 获取每日订单统计
   */
  async getDailyOrderStats(date: Date): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const stats = await this.orderRepository
        .createQueryBuilder('order')
        .select([
          'COUNT(*) as totalOrders',
          'SUM(totalAmount) as totalRevenue',
          'AVG(totalAmount) as averageOrderValue',
        ])
        .where('orderDate BETWEEN :start AND :end', {
          start: startOfDay,
          end: endOfDay,
        })
        .andWhere('status != "cancelled"')
        .getRawOne();

      return {
        totalOrders: parseInt(stats.totalOrders, 10) || 0,
        totalRevenue: parseFloat(stats.totalRevenue) || 0,
        averageOrderValue: parseFloat(stats.averageOrderValue) || 0,
      };
    } catch (error) {
      logger.error('[OrderRepository] 获取每日订单统计失败', { date, error });
      throw error;
    }
  }

  /**
   * 获取待处理订单列表
   */
  async getPendingOrders(limit: number = 10): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { status: 'pending' },
        order: { orderDate: 'ASC' },
        take: limit,
        relations: ['customer'],
      });
    } catch (error) {
      logger.error('[OrderRepository] 获取待处理订单失败', { error });
      throw error;
    }
  }

  /**
   * 批量更新订单状态
   */
  async batchUpdateStatus(ids: number[], status: Order['status']): Promise<number> {
    try {
      const result = await this.orderRepository.update(
        { id: In(ids) },
        { status, updatedAt: new Date() }
      );
      return result.affected || 0;
    } catch (error) {
      logger.error('[OrderRepository] 批量更新订单状态失败', { ids, status, error });
      throw error;
    }
  }

  /**
   * 获取客户的订单统计
   */
  async getCustomerOrderSummary(customerId: number): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date | null;
  }> {
    try {
      const result = await this.orderRepository
        .createQueryBuilder('order')
        .select([
          'COUNT(*) as totalOrders',
          'SUM(totalAmount) as totalSpent',
          'AVG(totalAmount) as averageOrderValue',
          'MAX(orderDate) as lastOrderDate',
        ])
        .where('customerId = :customerId', { customerId })
        .andWhere('status != "cancelled"')
        .getRawOne();

      return {
        totalOrders: parseInt(result.totalOrders, 10) || 0,
        totalSpent: parseFloat(result.totalSpent) || 0,
        averageOrderValue: parseFloat(result.averageOrderValue) || 0,
        lastOrderDate: result.lastOrderDate ? new Date(result.lastOrderDate) : null,
      };
    } catch (error) {
      logger.error('[OrderRepository] 获取客户订单摘要失败', { customerId, error });
      throw error;
    }
  }
}

export const orderRepository = new OrderRepository(dataSource);
export default orderRepository;