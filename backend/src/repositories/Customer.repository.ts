/**
 * @file Repositories/Customer.repository.ts
 * 客户仓储 - 客户数据访问层
 */

import { Repository, DataSource, Like, In, Between, FindOptionsWhere } from 'typeorm';
import { Customer } from '../Models/Customer.model';
import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { logger } from '../Config/winston.config';
import dataSource from '../Config/database';

export interface CustomerFilters {
  keyword?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  industry?: string;
  minCredit?: number;
  maxCredit?: number;
  registeredFrom?: Date;
  registeredTo?: Date;
}

export class CustomerRepository extends BaseRepository<Customer> {
  private customerRepository: Repository<Customer>;

  constructor(dataSource: DataSource) {
    super(dataSource, Customer);
    this.customerRepository = dataSource.getRepository(Customer);
  }

  /**
   * 根据公司名称查找客户
   */
  async findByCompanyName(companyName: string): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOne({
        where: { companyName: Like(`%${companyName}%`) },
      });
    } catch (error) {
      logger.error('[CustomerRepository] 根据公司名查找失败', { companyName, error });
      throw error;
    }
  }

  /**
   * 根据邮箱查找客户
   */
  async findByEmail(email: string): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOne({
        where: { contactEmail: email },
      });
    } catch (error) {
      logger.error('[CustomerRepository] 根据邮箱查找失败', { email, error });
      throw error;
    }
  }

  /**
   * 根据手机号查找客户
   */
  async findByPhone(phone: string): Promise<Customer | null> {
    try {
      return await this.customerRepository.findOne({
        where: { contactPhone: phone },
      });
    } catch (error) {
      logger.error('[CustomerRepository] 根据手机号查找失败', { phone, error });
      throw error;
    }
  }

  /**
   * 分页搜索客户
   */
  async searchCustomers(
    filters: CustomerFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Customer>> {
    try {
      const where: FindOptionsWhere<Customer> = {};

      // 关键词搜索
      if (filters.keyword) {
        where.companyName = Like(`%${filters.keyword}%`);
        // 或者使用 OR 条件 - 需要 TypeORM 的高级查询
      }

      // 状态筛选
      if (filters.status) {
        where.status = filters.status;
      }

      // 行业筛选
      if (filters.industry) {
        where.industry = filters.industry;
      }

      // 信用额度范围
      if (filters.minCredit !== undefined || filters.maxCredit !== undefined) {
        const creditRange: any = {};
        if (filters.minCredit !== undefined) {
          creditRange.gte = filters.minCredit;
        }
        if (filters.maxCredit !== undefined) {
          creditRange.lte = filters.maxCredit;
        }
        where.creditLimit = creditRange;
      }

      // 注册时间范围
      if (filters.registeredFrom || filters.registeredTo) {
        const dateRange: any = {};
        if (filters.registeredFrom) {
          dateRange.gte = filters.registeredFrom;
        }
        if (filters.registeredTo) {
          dateRange.lte = filters.registeredTo;
        }
        where.createdAt = dateRange;
      }

      return await this.findWithPagination(pagination, where);
    } catch (error) {
      logger.error('[CustomerRepository] 搜索客户失败', { filters, error });
      throw error;
    }
  }

  /**
   * 获取客户统计信息
   */
  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
    totalCredit: number;
    averageCredit: number;
  }> {
    try {
      const stats = await this.customerRepository
        .createQueryBuilder('customer')
        .select([
          'COUNT(*) as total',
          'SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active',
          'SUM(CASE WHEN status = "inactive" THEN 1 ELSE 0 END) as inactive',
          'SUM(CASE WHEN status = "suspended" THEN 1 ELSE 0 END) as suspended',
          'SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending',
          'SUM(creditLimit) as totalCredit',
          'AVG(creditLimit) as averageCredit',
        ])
        .getRawOne();

      return {
        total: parseInt(stats.total, 10) || 0,
        active: parseInt(stats.active, 10) || 0,
        inactive: parseInt(stats.inactive, 10) || 0,
        suspended: parseInt(stats.suspended, 10) || 0,
        pending: parseInt(stats.pending, 10) || 0,
        totalCredit: parseFloat(stats.totalCredit) || 0,
        averageCredit: parseFloat(stats.averageCredit) || 0,
      };
    } catch (error) {
      logger.error('[CustomerRepository] 获取统计信息失败', { error });
      throw error;
    }
  }

  /**
   * 获取行业分布统计
   */
  async getIndustryDistribution(): Promise<Array<{ industry: string; count: number }>> {
    try {
      const results = await this.customerRepository
        .createQueryBuilder('customer')
        .select(['customer.industry as industry', 'COUNT(*) as count'])
        .where('customer.industry IS NOT NULL')
        .groupBy('customer.industry')
        .orderBy('count', 'DESC')
        .getRawMany();

      return results.map(r => ({
        industry: r.industry,
        count: parseInt(r.count, 10),
      }));
    } catch (error) {
      logger.error('[CustomerRepository] 获取行业分布失败', { error });
      throw error;
    }
  }

  /**
   * 批量更新客户状态
   */
  async batchUpdateStatus(ids: number[], status: 'active' | 'inactive' | 'suspended' | 'pending'): Promise<number> {
    try {
      const result = await this.customerRepository.update(
        { id: In(ids) },
        { status }
      );
      return result.affected || 0;
    } catch (error) {
      logger.error('[CustomerRepository] 批量更新状态失败', { ids, status, error });
      throw error;
    }
  }

  /**
   * 检查客户是否存在（通过邮箱或手机号）
   */
  async checkExists(email?: string, phone?: string): Promise<{ emailExists: boolean; phoneExists: boolean }> {
    try {
      const result = {
        emailExists: false,
        phoneExists: false,
      };

      if (email) {
        const emailCount = await this.customerRepository.count({
          where: { contactEmail: email },
        });
        result.emailExists = emailCount > 0;
      }

      if (phone) {
        const phoneCount = await this.customerRepository.count({
          where: { contactPhone: phone },
        });
        result.phoneExists = phoneCount > 0;
      }

      return result;
    } catch (error) {
      logger.error('[CustomerRepository] 检查存在失败', { email, phone, error });
      throw error;
    }
  }

  /**
   * 获取客户订单统计
   */
  async getCustomerOrderStats(customerId: number): Promise<{
    totalOrders: number;
    totalAmount: number;
    averageOrderAmount: number;
  }> {
    try {
      const result = await this.customerRepository
        .createQueryBuilder('customer')
        .leftJoin('customer.orders', 'order')
        .select([
          'COUNT(order.id) as totalOrders',
          'SUM(order.totalAmount) as totalAmount',
          'AVG(order.totalAmount) as averageOrderAmount',
        ])
        .where('customer.id = :customerId', { customerId })
        .andWhere('order.status != "cancelled"')
        .getRawOne();

      return {
        totalOrders: parseInt(result.totalOrders, 10) || 0,
        totalAmount: parseFloat(result.totalAmount) || 0,
        averageOrderAmount: parseFloat(result.averageOrderAmount) || 0,
      };
    } catch (error) {
      logger.error('[CustomerRepository] 获取客户订单统计失败', { customerId, error });
      throw error;
    }
  }

  /**
   * 导出客户数据
   */
  async exportCustomers(filters: CustomerFilters): Promise<Customer[]> {
    try {
      const where: FindOptionsWhere<Customer> = {};

      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.industry) {
        where.industry = filters.industry;
      }
      if (filters.keyword) {
        where.companyName = Like(`%${filters.keyword}%`);
      }

      return await this.customerRepository.find({
        where,
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      logger.error('[CustomerRepository] 导出客户失败', { filters, error });
      throw error;
    }
  }
}

// 导出单例
export const customerRepository = new CustomerRepository(dataSource);
export default customerRepository;