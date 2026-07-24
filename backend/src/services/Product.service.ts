/**
 * Product Service - 产品业务逻辑层
 * 提供产品相关的完整业务逻辑处理
 * 包含产品 CRUD、库存管理、价格管理、变体管理、统计分析等
 */

import { BaseService } from './BaseService';
import { ProductRepository } from '../repositories/Product.repository';
import { generateCode } from '../utils';
import { ApiError } from '../exceptions/api.error';
import logger from '../utils/logger';

export interface ProductQueryOptions {
  category?: string;
  brand?: string;
  status?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  byCategory: any[];
  stockStats: {
    totalStock: number;
    averageStock: number;
    totalValue: number;
    averagePrice: number;
  };
}

export class ProductService extends BaseService<any> {
  private productRepository: ProductRepository;

  constructor() {
    super(new ProductRepository());
    this.productRepository = new ProductRepository();
  }

  // ============================================
  // 基础 CRUD（增强版）
  // ============================================

  /**
   * 创建产品（自动生成产品编码）
   */
  async createProduct(data: any): Promise<any> {
    try {
      // 验证数据
      if (!data.name || data.name.length < 2) {
        throw new ApiError(400, 'Product name must be at least 2 characters');
      }

      if (data.price !== undefined && data.price < 0) {
        throw new ApiError(400, 'Price must be greater than 0');
      }

      // 检查产品编码是否已存在
      if (data.productCode) {
        const existing = await this.productRepository.findByCode(data.productCode);
        if (existing) {
          throw new ApiError(409, 'Product code already exists');
        }
      }

      // 生成产品编码
      data.productCode = data.productCode || generateCode('PRD');
      data.status = data.status || 'active';
      data.currentStock = data.currentStock || 0;
      data.minStock = data.minStock || 5;

      const product = await this.create(data);
      logger.info(`Product created: ${product.productCode} - ${product.name}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * 更新产品信息
   */
  async updateProduct(id: string, data: any): Promise<any | null> {
    try {
      this.validateId(id);

      const product = await this.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // 检查产品编码是否被其他产品使用
      if (data.productCode) {
        const existing = await this.productRepository.findByCode(data.productCode);
        if (existing && existing._id.toString() !== id) {
          throw new ApiError(409, 'Product code already exists');
        }
      }

      const result = await this.update(id, data);
      logger.info(`Product updated: ${result.productCode} - ${result.name}`);
      return result;
    } catch (error) {
      logger.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * 删除产品（软删除）
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      this.validateId(id);
      const product = await this.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // 检查是否有未完成的订单包含此产品
      // 实际实现中需要调用 OrderService 检查

      const result = await this.delete(id);
      logger.info(`Product deleted: ${product.productCode}`);
      return result;
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw error;
    }
  }

  // ============================================
  // 查询方法
  // ============================================

  /**
   * 根据编码查询产品
   */
  async getByCode(code: string): Promise<any | null> {
    if (!code) return null;
    return this.productRepository.findByCode(code);
  }

  /**
   * 根据分类查询产品
   */
  async getByCategory(category: string): Promise<any[]> {
    if (!category) return [];
    return this.productRepository.findByCategory(category);
  }

  /**
   * 根据品牌查询产品
   */
  async getByBrand(brand: string): Promise<any[]> {
    if (!brand) return [];
    return this.productRepository.findByBrand(brand);
  }

  /**
   * 根据状态查询产品
   */
  async getByStatus(status: string): Promise<any[]> {
    if (!status) return [];
    return this.productRepository.findByStatus(status);
  }

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string): Promise<any[]> {
    if (!keyword || keyword.length < 2) {
      throw new ApiError(400, 'Keyword must be at least 2 characters');
    }
    return this.productRepository.search(keyword);
  }

  /**
   * 高级搜索
   */
  async advancedSearch(options: ProductQueryOptions): Promise<any[]> {
    return this.productRepository.advancedSearch(options);
  }

  /**
   * 获取产品列表（分页）
   */
  async getProductList(page: number = 1, limit: number = 10, filters?: any): Promise<any> {
    return this.paginate(filters || { status: 'active' }, page, limit);
  }

  // ============================================
  // 统计和分析方法
  // ============================================

  /**
   * 获取产品统计信息
   */
  async getProductStats(): Promise<ProductStats> {
    return this.productRepository.getProductStats();
  }

  /**
   * 获取分类统计
   */
  async getCategoryStats(): Promise<any[]> {
    return this.productRepository.getCategoryStats();
  }

  /**
   * 获取畅销产品
   */
  async getTopSelling(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    return this.productRepository.getTopSelling(limit, startDate, endDate);
  }

  /**
   * 获取低库存产品
   */
  async getLowStock(threshold: number = 10): Promise<any[]> {
    return this.productRepository.getLowStock(threshold);
  }

  /**
   * 获取产品详情（含变体和销售统计）
   */
  async getProductDetail(id: string): Promise<any> {
    this.validateId(id);
    const detail = await this.productRepository.getProductDetail(id);
    if (!detail || detail.length === 0) {
      throw new ApiError(404, 'Product not found');
    }
    return detail[0];
  }

  // ============================================
  // 操作方法
  // ============================================

  /**
   * 更新产品库存
   */
  async updateProductStock(id: string, quantity: number, type: 'add' | 'subtract' | 'set', reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      const product = await this.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      let newQuantity: number;
      switch (type) {
        case 'add':
          newQuantity = product.currentStock + quantity;
          break;
        case 'subtract':
          if (product.currentStock < quantity) {
            throw new ApiError(400, 'Insufficient stock');
          }
          newQuantity = product.currentStock - quantity;
          break;
        case 'set':
          if (quantity < 0) {
            throw new ApiError(400, 'Quantity cannot be negative');
          }
          newQuantity = quantity;
          break;
        default:
          throw new ApiError(400, 'Invalid stock operation type');
      }

      const result = await this.productRepository.updateStock(id, newQuantity - product.currentStock);
      logger.info(`Product stock updated: ${product.productCode} - ${type} ${quantity}`);
      return result;
    } catch (error) {
      logger.error('Error updating product stock:', error);
      throw error;
    }
  }

  /**
   * 更新产品价格
   */
  async updateProductPrice(id: string, price: number, reason: string): Promise<any | null> {
    try {
      this.validateId(id);

      if (price < 0) {
        throw new ApiError(400, 'Price must be greater than 0');
      }

      const product = await this.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      const result = await this.productRepository.updatePrice(id, price, reason);
      logger.info(`Product price updated: ${product.productCode} - ${price}`);
      return result;
    } catch (error) {
      logger.error('Error updating product price:', error);
      throw error;
    }
  }

  /**
   * 更新产品状态
   */
  async updateProductStatus(id: string, status: string, reason?: string): Promise<any | null> {
    try {
      this.validateId(id);

      const validStatuses = ['active', 'inactive', 'discontinued'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }

      const product = await this.findById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      const result = await this.update(id, { status, statusReason: reason });
      logger.info(`Product status updated: ${product.productCode} -> ${status}`);
      return result;
    } catch (error) {
      logger.error('Error updating product status:', error);
      throw error;
    }
  }

  // ============================================
  // 变体管理
  // ============================================

  /**
   * 获取产品变体
   */
  async getProductVariants(id: string): Promise<any[]> {
    this.validateId(id);
    const variants = await this.productRepository.getProductVariants(id);
    if (!variants || variants.length === 0) {
      return [];
    }
    return variants[0]?.variants || [];
  }

  /**
   * 添加产品变体
   */
  async addProductVariant(productId: string, variantData: any): Promise<any> {
    try {
      this.validateId(productId);

      const product = await this.findById(productId);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // 实际实现中需要调用 Variant Model 创建
      // 这里只是示例逻辑
      const variant = {
        ...variantData,
        productId,
        createdAt: new Date()
      };

      logger.info(`Variant added to product: ${product.productCode}`);
      return variant;
    } catch (error) {
      logger.error('Error adding product variant:', error);
      throw error;
    }
  }

  /**
   * 更新产品变体
   */
  async updateProductVariant(productId: string, variantId: string, data: any): Promise<any> {
    this.validateId(productId);
    // 实际实现中需要调用 Variant Repository
    logger.info(`Variant updated: ${variantId}`);
    return data;
  }

  /**
   * 删除产品变体
   */
  async deleteProductVariant(productId: string, variantId: string): Promise<boolean> {
    this.validateId(productId);
    // 实际实现中需要调用 Variant Repository
    logger.info(`Variant deleted: ${variantId}`);
    return true;
  }

  // ============================================
  // 批量操作
  // ============================================

  /**
   * 批量更新产品状态
   */
  async batchUpdateStatus(ids: string[], status: string): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }

    const validStatuses = ['active', 'inactive', 'discontinued'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const result = await this.productRepository.batchUpdateStatus(ids, status);
    logger.info(`Batch updated ${result} products to ${status}`);
    return result;
  }

  /**
   * 批量删除产品
   */
  async batchDeleteProducts(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }
    const result = await this.batchDelete(ids);
    logger.info(`Batch deleted ${result} products`);
    return result;
  }

  /**
   * 应用折扣到产品
   */
  async applyDiscount(ids: string[], discountPercent: number): Promise<number> {
    if (!ids || ids.length === 0) {
      throw new ApiError(400, 'IDs are required');
    }

    if (discountPercent < 0 || discountPercent > 100) {
      throw new ApiError(400, 'Discount must be between 0 and 100');
    }

    let updatedCount = 0;
    for (const id of ids) {
      const product = await this.findById(id);
      if (product) {
        const newPrice = product.price * (1 - discountPercent / 100);
        await this.updateProductPrice(id, newPrice, `Discount applied: ${discountPercent}%`);
        updatedCount++;
      }
    }

    logger.info(`Applied ${discountPercent}% discount to ${updatedCount} products`);
    return updatedCount;
  }
}

export default ProductService;