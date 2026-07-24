/**
 * Customer Service - 客户业务逻辑层
 * 提供客户相关的完整业务逻辑处理
 * 包含客户 CRUD、统计、分析、批量操作等
 */

import { BaseService } from './BaseService';
import { CustomerRepository } from '../repositories/Customer.repository';
import { generateCode, sanitize } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface CustomerQueryOptions {
  status?: string;
  keyword?: string;
  minBalance?: number;
  maxBalance?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class CustomerService extends BaseService<any> {
  private customerRepository: CustomerRepository;

  constructor() {
    super(new CustomerRepository());
    this.customerRepository = new CustomerRepository();
  }

  // ============================================
  // 基础 CRUD（增强版）
  // ============================================

  /**
   * 创建客户（自动生成客户编码）
   */
  async createCustomer(data: any): Promise<any> {
    try {
      // 检查邮箱是否已存在
      if (data.email) {
        const existing = await this.customerRepository.findByEmail(data.email);
        if (existing) {
          throw new ApiError(409, 'Email already exists');
        }
      }

      // 检查电话是否已存在
      if (data.phone) {
        const existing = await this.customerRepository.findByPhone(data.phone);
        if (existing) {
          throw new ApiError(409, 'Phone number already exists');
        }
      }

      // 生成客户编码
      data.customerCode = data.customerCode || generateCode('CUS');
      data.status = data.status || 'active';
      data.currentBalance = data.currentBalance || 0;

      const customer = await this.create(data);
      logger.info(`Customer created: ${customer.customerCode} - ${customer.name}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * 更新客户信息
   */
  async updateCustomer(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      // 检查邮箱是否被其他客户使用
      if (data.email) {
        const existing = await this.customerRepository.findByEmail(data.email);
        if (existing && existing._id.toString() !== id) {
          throw new ApiError(409, 'Email already exists');
        }
      }

      // 检查电话是否被其他客户使用
      if (data.phone) {
        const existing = await this.customerRepository.findByPhone(data.phone);
        if (existing && existing._id.toString() !== id) {
          throw new ApiError(409, 'Phone number already exists');
        }
      }

      const customer = await this.update(id, data);
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }

      logger.info(`Customer updated: ${customer.customerCode}`);
      return customer;
    } catch (error) {
      logger.error('Error updating customer:', error);
      throw error;
    }
  }

  /**
   * 删除客户（软删除）
   */
  async deleteCustomer(id: string): Promise<boolean> {
    try {
      this.validateId(id);
      const customer = await this.findById(id);
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }

      // 检查是否有未完成的订单
      // 实际实现中需要调用 OrderService 检查

      const result = await this.delete(id);
      logger.info(`Customer deleted: ${customer.customerCode}`);
      return result;
    } catch (error) {
      logger.error('Error deleting customer:', error);
      throw error;
    }
  }

  // ============================================
  // 查询方法
  // ============================================

  /**
   * 根据邮箱获取客户
   */
  async getByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    return this.customerRepository.findByEmail(email);
  }

  /**
   * 根据电话获取客户
   */
  async getByPhone(phone: string): Promise<any | null> {
    if (!phone) return null;
    return this.customerRepository.findByPhone(phone);
  }

  /**
   * 根据编码获取客户
   */
  async getByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.customerRepository.findByCode(code);
  }

  /**
   * 搜索客户
   */
  async searchCustomers(keyword: string): Promise<any[]> {
    if (!keyword || keyword.length < 2) {
      throw new ApiError(400, 'Keyword must be at least 2 characters');
    }
    return this.customerRepository.search(keyword);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: CustomerQueryOptions): Promise<any[]> {
    return this.customerRepository.advancedSearch(options);
  }

  /**
   * 获取客户列表（分页）
   */
  async getCustomerList(
    page: number = 1,
    limit: number = 10,
    filters?: any
  ): Promise<any> {
    return this.paginate(filters || {}, page, limit);
  }

  // ============================================
  // 统计和分析方法
  // ============================================

  /**
   * 获取客户统计信息
   */
  async getCustomerStats(): Promise<any> {
    return this.customerRepository.getCustomerStats();
  }

  /**
   * 获取客户消费分析
   */
  async getCustomerSpendingAnalysis(customerId: string): Promise<any> {
    if (!customerId) {
      throw new ApiError(400, 'Customer ID is required');
    }
    return this.customerRepository.getCustomerSpendingAnalysis(customerId);
  }

  /**
   * 获取客户地理分布
   */
  async getGeographicDistribution(): Promise<any[]> {
    return this.customerRepository.getGeographicDistribution();
  }

  /**
   * 获取即将过期的客户
   */
  async getExpiringCustomers(days: number = 30): Promise<any[]> {
    return this.customerRepository.getExpiringCustomers(days);
  }

  /**
   * 获取客户订单汇总
   */
  async getCustomerOrderSummary(customerId: string): Promise<any> {
    if (!customerId) {
      throw new ApiError(400, 'Customer ID is required');
    }
    return this.customerRepository.getCustomersWithOrders(customerId);
  }

  // ============================================
  // 操作方法
  // ============================================

  /**
   * 更新客户余额
   */
  async updateCustomerBalance(id: string, amount: number): Promise<any | null> {
    try {
      this.validateId(id);
      if (amount === 0) {
        throw new ApiError(400, 'Amount must be non-zero');
      }

      const customer = await this.customerRepository.updateBalance(id, amount);
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }

      logger.info(`Customer balance updated: ${customer.customerCode}, amount: ${amount}`);
      return customer;
    } catch (error) {
      logger.error('Error updating customer balance:', error);
      throw error;
    }
  }

  /**
   * 更新客户状态
   */
  async updateCustomerStatus(id: string, status: string, reason?: string): Promise<any | null> {
    try {
      this.validateId(id);
      const validStatuses = ['active', 'inactive', 'suspended'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }

      const customer = await this.update(id, { status, statusReason: reason });
      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }

      logger.info(`Customer status updated: ${customer.customerCode} -> ${status}`);
      return customer;
    } catch (error) {
      logger.error('Error updating customer status:', error);
      throw error;
    }
  }

  /**
   * 批量删除客户
   */
  async batchDeleteCustomers(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }
    const result = await this.customerRepository.batchDelete(ids);
    logger.info(`Batch deleted ${result} customers`);
    return result;
  }

  /**
   * 批量更新客户状态
   */
  async batchUpdateStatus(ids: string[], status: string): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const result = await this.customerRepository.batchUpdateStatus(ids, status);
    logger.info(`Batch updated ${result} customers to ${status}`);
    return result;
  }

  /**
   * 检查客户是否存在
   */
  async customerExists(email?: string, phone?: string): Promise<boolean> {
    if (email && phone) {
      return this.customerRepository.existsByEmailOrPhone(email, phone);
    }
    if (email) {
      const customer = await this.getByEmail(email);
      return !!customer;
    }
    if (phone) {
      const customer = await this.getByPhone(phone);
      return !!customer;
    }
    return false;
  }

  /**
   * 获取客户详情（含关联数据）
   */
  async getCustomerDetail(id: string): Promise<any> {
    this.validateId(id);
    const customer = await this.findById(id);
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
    return customer;
  }

  /**
   * 根据公司名称搜索客户
   */
  async findByCompany(company: string): Promise<any[]> {
    if (!company) return [];
    return this.customerRepository.findByCompany(company);
  }
}

export default CustomerService;