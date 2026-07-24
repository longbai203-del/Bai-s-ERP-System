/**
 * @file Repositories/Product.repository.ts
 * 产品仓储 - 产品数据访问层
 */

import { Repository, DataSource, Like, In, Between, FindOptionsWhere } from 'typeorm';
import { Product } from '../Models/Product.model';
import { BaseRepository, PaginationOptions, PaginatedResult } from './BaseRepository';
import { logger } from '../Config/winston.config';
import dataSource from '../Config/database';

export interface ProductFilters {
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  brand?: string;
}

export class ProductRepository extends BaseRepository<Product> {
  private productRepository: Repository<Product>;

  constructor(dataSource: DataSource) {
    super(dataSource, Product);
    this.productRepository = dataSource.getRepository(Product);
  }

  /**
   * 根据SKU查找产品
   */
  async findBySku(sku: string): Promise<Product | null> {
    try {
      return await this.productRepository.findOne({
        where: { sku },
      });
    } catch (error) {
      logger.error('[ProductRepository] 根据SKU查找失败', { sku, error });
      throw error;
    }
  }

  /**
   * 根据分类获取产品列表
   */
  async findByCategory(category: string): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: { category },
        order: { name: 'ASC' },
      });
    } catch (error) {
      logger.error('[ProductRepository] 根据分类查找失败', { category, error });
      throw error;
    }
  }

  /**
   * 分页搜索产品
   */
  async searchProducts(
    filters: ProductFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Product>> {
    try {
      const where: FindOptionsWhere<Product> = {};

      if (filters.category) {
        where.category = filters.category;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.brand) {
        where.brand = filters.brand;
      }
      if (filters.keyword) {
        where.name = Like(`%${filters.keyword}%`);
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const priceRange: any = {};
        if (filters.minPrice !== undefined) {
          priceRange.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          priceRange.lte = filters.maxPrice;
        }
        where.unitPrice = priceRange;
      }
      if (filters.minStock !== undefined || filters.maxStock !== undefined) {
        const stockRange: any = {};
        if (filters.minStock !== undefined) {
          stockRange.gte = filters.minStock;
        }
        if (filters.maxStock !== undefined) {
          stockRange.lte = filters.maxStock;
        }
        where.stockQuantity = stockRange;
      }

      return await this.findWithPagination(pagination, where);
    } catch (error) {
      logger.error('[ProductRepository] 搜索产品失败', { filters, error });
      throw error;
    }
  }

  /**
   * 获取产品统计信息
   */
  async getProductStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    discontinuedProducts: number;
    totalStockValue: number;
    averagePrice: number;
    categoriesCount: number;
  }> {
    try {
      const stats = await this.productRepository
        .createQueryBuilder('product')
        .select([
          'COUNT(*) as totalProducts',
          'SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as activeProducts',
          'SUM(CASE WHEN status = "inactive" THEN 1 ELSE 0 END) as inactiveProducts',
          'SUM(CASE WHEN status = "discontinued" THEN 1 ELSE 0 END) as discontinuedProducts',
          'SUM(stockQuantity * unitPrice) as totalStockValue',
          'AVG(unitPrice) as averagePrice',
          'COUNT(DISTINCT category) as categoriesCount',
        ])
        .getRawOne();

      return {
        totalProducts: parseInt(stats.totalProducts, 10) || 0,
        activeProducts: parseInt(stats.activeProducts, 10) || 0,
        inactiveProducts: parseInt(stats.inactiveProducts, 10) || 0,
        discontinuedProducts: parseInt(stats.discontinuedProducts, 10) || 0,
        totalStockValue: parseFloat(stats.totalStockValue) || 0,
        averagePrice: parseFloat(stats.averagePrice) || 0,
        categoriesCount: parseInt(stats.categoriesCount, 10) || 0,
      };
    } catch (error) {
      logger.error('[ProductRepository] 获取产品统计失败', { error });
      throw error;
    }
  }

  /**
   * 获取库存预警产品
   */
  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    try {
      const query = this.productRepository
        .createQueryBuilder('product')
        .where('stockQuantity <= minStock')
        .andWhere('status = "active"')
        .orderBy('stockQuantity', 'ASC');

      if (threshold) {
        query.limit(threshold);
      }

      return await query.getMany();
    } catch (error) {
      logger.error('[ProductRepository] 获取低库存产品失败', { error });
      throw error;
    }
  }

  /**
   * 更新库存数量
   */
  async updateStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ 
          stockQuantity: quantity,
          updatedAt: new Date(),
        })
        .where('id = :productId', { productId })
        .execute();

      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error('[ProductRepository] 更新库存失败', { productId, quantity, error });
      throw error;
    }
  }

  /**
   * 调整库存（增量）
   */
  async adjustStock(productId: number, delta: number): Promise<boolean> {
    try {
      const result = await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ 
          stockQuantity: () => `stockQuantity + ${delta}`,
          updatedAt: new Date(),
        })
        .where('id = :productId', { productId })
        .andWhere('stockQuantity + :delta >= 0', { delta })
        .execute();

      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      logger.error('[ProductRepository] 调整库存失败', { productId, delta, error });
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<string[]> {
    try {
      const results = await this.productRepository
        .createQueryBuilder('product')
        .select('DISTINCT category')
        .where('category IS NOT NULL')
        .andWhere('category != ""')
        .orderBy('category', 'ASC')
        .getRawMany();

      return results.map(r => r.category).filter(Boolean);
    } catch (error) {
      logger.error('[ProductRepository] 获取分类列表失败', { error });
      throw error;
    }
  }

  /**
   * 获取品牌列表
   */
  async getBrands(): Promise<string[]> {
    try {
      const results = await this.productRepository
        .createQueryBuilder('product')
        .select('DISTINCT brand')
        .where('brand IS NOT NULL')
        .andWhere('brand != ""')
        .orderBy('brand', 'ASC')
        .getRawMany();

      return results.map(r => r.brand).filter(Boolean);
    } catch (error) {
      logger.error('[ProductRepository] 获取品牌列表失败', { error });
      throw error;
    }
  }

  /**
   * 批量更新产品状态
   */
  async batchUpdateStatus(ids: number[], status: Product['status']): Promise<number> {
    try {
      const result = await this.productRepository.update(
        { id: In(ids) },
        { status, updatedAt: new Date() }
      );
      return result.affected || 0;
    } catch (error) {
      logger.error('[ProductRepository] 批量更新状态失败', { ids, status, error });
      throw error;
    }
  }
}

export const productRepository = new ProductRepository(dataSource);
export default productRepository;