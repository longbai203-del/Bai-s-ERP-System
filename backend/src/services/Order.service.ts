/**
 * Order Service - 订单业务逻辑层
 * 提供订单相关的完整业务逻辑处理
 * 包含订单 CRUD、订单状态管理、订单统计、订单项管理、退货管理等
 */

import { BaseService } from './BaseService';
import { OrderRepository } from '../repositories/Order.repository';
import { generateOrderNo, calculatePercentage } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface OrderQueryOptions {
  status?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  shippingMethod?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageAmount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  cancelledCount: number;
  shippedCount: number;
  deliveredCount: number;
  revenueByStatus: any[];
  dailyStats: any[];
}

export class OrderService extends BaseService<any> {
  private orderRepository: OrderRepository;

  constructor() {
    super(new OrderRepository());
    this.orderRepository = new OrderRepository();
  }

  /**
   * 创建订单
   */
  async createOrder(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.customerId) {
        throw new ApiError(400, 'Customer ID is required');
      }

      if (!data.items || data.items.length === 0) {
        throw new ApiError(400, 'At least one item is required');
      }

      if (!data.shippingAddress) {
        throw new ApiError(400, 'Shipping address is required');
      }

      // 生成订单号
      data.orderNo = data.orderNo || generateOrderNo();

      // 计算订单金额
      let totalAmount = 0;
      data.items.forEach((item: any) => {
        if (!item.productId) {
          throw new ApiError(400, 'Product ID is required for each item');
        }
        if (!item.quantity || item.quantity < 1) {
          throw new ApiError(400, 'Quantity must be at least 1');
        }
        if (item.price === undefined || item.price < 0) {
          throw new ApiError(400, 'Price must be positive');
        }

        item.total = item.quantity * item.price;
        totalAmount += item.total;
      });

      data.totalAmount = totalAmount;
      data.discount = data.discount || 0;
      data.tax = data.tax || 0;
      data.shippingCost = data.shippingCost || 0;

      // 计算最终金额
      data.finalAmount = totalAmount - data.discount + data.tax + data.shippingCost;

      // 设置默认状态
      data.status = data.status || 'pending';
      data.paymentStatus = data.paymentStatus || 'unpaid';
      data.createdBy = data.createdBy || 'system';

      const order = await this.create(data);
      logger.info(`Order created: ${order.orderNo} - ${order.finalAmount}`);
      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating order:', error);
      throw new ApiError(500, 'Failed to create order');
    }
  }

  /**
   * 更新订单
   */
  async updateOrder(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      const order = await this.findById(id);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // 已完成的订单不能修改
      if (order.status === 'completed' || order.status === 'cancelled') {
        throw new ApiError(400, `Cannot update ${order.status} order`);
      }

      // 如果更新了项目，重新计算金额
      if (data.items) {
        let totalAmount = 0;
        data.items.forEach((item: any) => {
          item.total = item.quantity * item.price;
          totalAmount += item.total;
        });
        data.totalAmount = totalAmount;
        data.finalAmount = totalAmount - (data.discount || order.discount) + (data.tax || order.tax);
      }

      const result = await this.update(id, data);
      logger.info(`Order updated: ${result.orderNo}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating order:', error);
      throw new ApiError(500, 'Failed to update order');
    }
  }

  /**
   * 删除订单
   */
  async deleteOrder(id: string): Promise<boolean> {
    try {
      this.validateId(id);

      const order = await this.findById(id);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // 只有待处理或已取消的订单可以删除
      if (order.status !== 'pending' && order.status !== 'cancelled') {
        throw new ApiError(400, `Cannot delete ${order.status} order`);
      }

      const result = await this.delete(id);
      logger.info(`Order deleted: ${order.orderNo}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting order:', error);
      throw new ApiError(500, 'Failed to delete order');
    }
  }

  /**
   * 根据订单号查询
   */
  async getByOrderNo(orderNo: string): Promise<any | null> {
    if (!orderNo) return null;
    return this.orderRepository.findByOrderNo(orderNo);
  }

  /**
   * 根据客户查询
   */
  async getByCustomer(customerId: string, page: number = 1, limit: number = 10): Promise<any> {
    if (!customerId) {
      throw new ApiError(400, 'Customer ID is required');
    }
    const orders = await this.orderRepository.findByCustomer(customerId);
    return {
      data: orders.slice((page - 1) * limit, page * limit),
      total: orders.length,
      page,
      limit,
      totalPages: Math.ceil(orders.length / limit)
    };
  }

  /**
   * 根据状态查询
   */
  async getByStatus(status: string, page: number = 1, limit: number = 10): Promise<any> {
    if (!status) {
      throw new ApiError(400, 'Status is required');
    }
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const orders = await this.orderRepository.findByStatus(status);
    return {
      data: orders.slice((page - 1) * limit, page * limit),
      total: orders.length,
      page,
      limit,
      totalPages: Math.ceil(orders.length / limit)
    };
  }

  /**
   * 根据日期范围查询
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  /**
   * 根据付款方式查询
   */
  async getByPaymentMethod(paymentMethod: string): Promise<any[]> {
    if (!paymentMethod) return [];
    return this.orderRepository.findByPaymentMethod(paymentMethod);
  }

  /**
   * 搜索订单
   */
  async searchOrders(keyword: string): Promise<any[]> {
    if (!keyword || keyword.length < 2) {
      throw new ApiError(400, 'Keyword must be at least 2 characters');
    }
    return this.orderRepository.search(keyword);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: OrderQueryOptions): Promise<any[]> {
    return this.orderRepository.advancedSearch(options);
  }

  /**
   * 获取订单列表（分页）
   */
  async getOrderList(page: number = 1, limit: number = 10, filters?: any): Promise<any> {
    return this.paginate(filters || {}, page, limit);
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(): Promise<OrderStats> {
    return this.orderRepository.getStatistics();
  }

  /**
   * 获取详细统计
   */
  async getDetailedStats(period: 'today' | 'week' | 'month' | 'year' | 'all' = 'month'): Promise<any> {
    const stats = await this.getOrderStats();

    // 根据周期计算额外统计
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    const periodOrders = await this.getByDateRange(startDate, endDate);

    return {
      ...stats,
      period: {
        startDate,
        endDate,
        periodOrders: periodOrders.length,
        periodRevenue: periodOrders.reduce((sum: number, o: any) => sum + o.finalAmount, 0)
      }
    };
  }

  /**
   * 获取收入统计
   */
  async getRevenueStats(startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month' = 'day'): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    return this.orderRepository.getRevenueStats(startDate, endDate, groupBy);
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(id: string, status: string, reason?: string): Promise<any | null> {
    try {
      this.validateId(id);

      const order = await this.findById(id);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }

      // 已完成的订单不能更改状态
      if (order.status === 'completed') {
        throw new ApiError(400, 'Cannot change status of completed order');
      }

      // 已取消的订单只能恢复为待处理
      if (order.status === 'cancelled' && status !== 'pending') {
        throw new ApiError(400, 'Cancelled order can only be restored to pending');
      }

      const result = await this.orderRepository.updateOrderStatus(id, status, reason);
      logger.info(`Order status updated: ${order.orderNo} -> ${status}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating order status:', error);
      throw new ApiError(500, 'Failed to update order status');
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(id: string, reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      const order = await this.findById(id);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      if (order.status === 'completed') {
        throw new ApiError(400, 'Cannot cancel completed order');
      }

      if (order.status === 'cancelled') {
        throw new ApiError(400, 'Order is already cancelled');
      }

      const result = await this.orderRepository.updateOrderStatus(id, 'cancelled', reason);
      logger.info(`Order cancelled: ${order.orderNo} - ${reason}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error cancelling order:', error);
      throw new ApiError(500, 'Failed to cancel order');
    }
  }

  /**
   * 添加订单项
   */
  async addOrderItem(orderId: string, item: any): Promise<any | null> {
    try {
      this.validateId(orderId);

      const order = await this.findById(orderId);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        throw new ApiError(400, `Cannot add items to ${order.status} order`);
      }

      // 计算项目金额
      item.total = item.quantity * item.price;

      // 更新订单
      order.items.push(item);
      order.totalAmount += item.total;
      order.finalAmount = order.totalAmount - order.discount + order.tax;

      const result = await this.update(orderId, {
        items: order.items,
        totalAmount: order.totalAmount,
        finalAmount: order.finalAmount
      });

      logger.info(`Item added to order: ${order.orderNo} - ${item.productName}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error adding order item:', error);
      throw new ApiError(500, 'Failed to add order item');
    }
  }

  /**
   * 更新订单项
   */
  async updateOrderItem(orderId: string, itemId: string, data: any): Promise<any | null> {
    try {
      this.validateId(orderId);

      const order = await this.findById(orderId);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        throw new ApiError(400, `Cannot update items in ${order.status} order`);
      }

      // 查找并更新订单项
      const itemIndex = order.items.findIndex((i: any) => i._id.toString() === itemId);
      if (itemIndex === -1) {
        throw new ApiError(404, 'Order item not found');
      }

      const oldTotal = order.items[itemIndex].total;
      const item = order.items[itemIndex];

      // 更新字段
      if (data.quantity !== undefined) item.quantity = data.quantity;
      if (data.price !== undefined) item.price = data.price;
      item.total = item.quantity * item.price;

      // 重新计算订单金额
      order.totalAmount = order.totalAmount - oldTotal + item.total;
      order.finalAmount = order.totalAmount - order.discount + order.tax;

      const result = await this.update(orderId, {
        items: order.items,
        totalAmount: order.totalAmount,
        finalAmount: order.finalAmount
      });

      logger.info(`Order item updated: ${order.orderNo}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating order item:', error);
      throw new ApiError(500, 'Failed to update order item');
    }
  }

  /**
   * 删除订单项
   */
  async removeOrderItem(orderId: string, itemId: string): Promise<any | null> {
    try {
      this.validateId(orderId);

      const order = await this.findById(orderId);
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        throw new ApiError(400, `Cannot remove items from ${order.status} order`);
      }

      // 查找并删除订单项
      const itemIndex = order.items.findIndex((i: any) => i._id.toString() === itemId);
      if (itemIndex === -1) {
        throw new ApiError(404, 'Order item not found');
      }

      const removedItem = order.items[itemIndex];
      order.items.splice(itemIndex, 1);

      // 重新计算订单金额
      order.totalAmount -= removedItem.total;
      order.finalAmount = order.totalAmount - order.discount + order.tax;

      const result = await this.update(orderId, {
        items: order.items,
        totalAmount: order.totalAmount,
        finalAmount: order.finalAmount
      });

      logger.info(`Order item removed: ${order.orderNo}`);
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error removing order item:', error);
      throw new ApiError(500, 'Failed to remove order item');
    }
  }

  /**
   * 获取待处理订单（超时未处理）
   */
  async getPendingOrders(hours: number = 24): Promise<any[]> {
    if (hours < 1) {
      throw new ApiError(400, 'Hours must be at least 1');
    }
    return this.orderRepository.getPendingOrders(hours);
  }

  /**
   * 批量更新订单状态
   */
  async batchUpdateStatus(ids: string[], status: string): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const result = await this.orderRepository.batchUpdateStatus(ids, status);
    logger.info(`Batch updated ${result} orders to ${status}`);
    return result;
  }

  /**
   * 获取客户订单汇总
   */
  async getCustomerOrderSummary(customerId: string): Promise<any> {
    if (!customerId) {
      throw new ApiError(400, 'Customer ID is required');
    }
    return this.orderRepository.getCustomerOrderSummary(customerId);
  }

  /**
   * 获取订单详情（含订单项）
   */
  async getOrderDetail(id: string): Promise<any> {
    this.validateId(id);
    const detail = await this.orderRepository.getOrderDetail(id);
    if (!detail || detail.length === 0) {
      throw new ApiError(404, 'Order not found');
    }
    return detail[0];
  }
}

export default OrderService;