/**
 * @file product.controller.js
 * @description 商品控制器
 * @module controllers/product.controller
 */

import { supabaseService } from '../services/supabase.service.js';
import { success, error } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const productController = {
    async getList(req, res) {
        try {
            const { page = 1, pageSize = 20, name, category, status, sku } = req.query;
            const result = await supabaseService.getProducts({
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10),
                name, category, status, sku
            });
            if (!result.success) {
                return error(res, result.error || '获取商品列表失败', 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[ProductController] getList error:', error);
            return error(res, '获取商品列表失败', 500);
        }
    },

    async getDetail(req, res) {
        try {
            const { id } = req.params;
            const result = await supabaseService.getProductById(id);
            if (!result.success) {
                return error(res, result.error === 'PRODUCT_NOT_FOUND' ? '商品不存在' : result.error, result.error === 'PRODUCT_NOT_FOUND' ? 404 : 500);
            }
            return success(res, result.data);
        } catch (error) {
            logger.error('[ProductController] getDetail error:', error);
            return error(res, '获取商品详情失败', 500);
        }
    },

    async create(req, res) {
        try {
            const { name, category, price, cost, stock, unit, status, description, sku } = req.body;
            if (!name || !category || price === undefined || price === null) {
                return error(res, '缺少必填字段: name, category, price', 400);
            }
            const productData = {
                name, category, price, cost: cost || 0, stock: stock || 0,
                unit: unit || '个', status: status || 'active',
                description: description || '', sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
                created_by: req.userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const result = await supabaseService.createProduct(productData);
            if (!result.success) {
                return error(res, result.error || '创建商品失败', 500);
            }
            return success(res, result.data, '商品创建成功');
        } catch (error) {
            logger.error('[ProductController] create error:', error);
            return error(res, '创建商品失败', 500);
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, category, price, cost, stock, unit, status, description, sku } = req.body;
            const existing = await supabaseService.getProductById(id);
            if (!existing.success) {
                return error(res, '商品不存在', 404);
            }
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (category !== undefined) updateData.category = category;
            if (price !== undefined) updateData.price = price;
            if (cost !== undefined) updateData.cost = cost;
            if (stock !== undefined) updateData.stock = stock;
            if (unit !== undefined) updateData.unit = unit;
            if (status !== undefined) updateData.status = status;
            if (description !== undefined) updateData.description = description;
            if (sku !== undefined) updateData.sku = sku;
            updateData.updated_at = new Date().toISOString();
            const result = await supabaseService.updateProduct(id, updateData);
            if (!result.success) {
                return error(res, result.error || '更新商品失败', 500);
            }
            return success(res, result.data, '商品更新成功');
        } catch (error) {
            logger.error('[ProductController] update error:', error);
            return error(res, '更新商品失败', 500);
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await supabaseService.deleteProduct(id);
            if (!result.success) {
                return error(res, result.error === 'PRODUCT_NOT_FOUND' ? '商品不存在' : result.error, result.error === 'PRODUCT_NOT_FOUND' ? 404 : 500);
            }
            return success(res, null, '商品删除成功');
        } catch (error) {
            logger.error('[ProductController] delete error:', error);
            return error(res, '删除商品失败', 500);
        }
    },

    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, note } = req.body;
            if (quantity === undefined || quantity === null) {
                return error(res, '请提供库存变化数量', 400);
            }
            const existing = await supabaseService.getProductById(id);
            if (!existing.success) {
                return error(res, '商品不存在', 404);
            }
            const newStock = existing.data.stock + quantity;
            if (newStock < 0) {
                return error(res, '库存不能为负数', 400);
            }
            const result = await supabaseService.updateProduct(id, { stock: newStock, updated_at: new Date().toISOString() });
            if (!result.success) {
                return error(res, result.error || '更新库存失败', 500);
            }
            await supabaseService.createStockLog({
                product_id: id, quantity, note: note || '库存调整',
                created_by: req.userId, created_at: new Date().toISOString()
            });
            return success(res, result.data, '库存更新成功');
        } catch (error) {
            logger.error('[ProductController] updateStock error:', error);
            return error(res, '更新库存失败', 500);
        }
    },

    async getCategories(req, res) {
        try {
            const result = await supabaseService.getProductCategories();
            return success(res, result.data || []);
        } catch (error) {
            logger.error('[ProductController] getCategories error:', error);
            return error(res, '获取分类列表失败', 500);
        }
    },

    async getStats(req, res) {
        try {
            const result = await supabaseService.getProductStats();
            return success(res, result.data || {});
        } catch (error) {
            logger.error('[ProductController] getStats error:', error);
            return error(res, '获取商品统计失败', 500);
        }
    },

    async search(req, res) {
        try {
            const { keyword, limit = 10 } = req.query;
            if (!keyword || keyword.length < 2) {
                return error(res, '请输入至少2个字符的搜索关键词', 400);
            }
            const result = await supabaseService.searchProducts(keyword, parseInt(limit, 10));
            return success(res, result.data || []);
        } catch (error) {
            logger.error('[ProductController] search error:', error);
            return error(res, '搜索商品失败', 500);
        }
    },

    async exportData(req, res) {
        try {
            const result = await supabaseService.getAllProducts();
            if (!result.success) {
                return error(res, result.error || '导出数据失败', 500);
            }
            return success(res, result.data, '导出成功');
        } catch (error) {
            logger.error('[ProductController] exportData error:', error);
            return error(res, '导出失败', 500);
        }
    },

    async bulkImport(req, res) {
        try {
            const { products } = req.body;
            if (!products || !Array.isArray(products) || products.length === 0) {
                return error(res, '请提供商品数组', 400);
            }
            const results = [];
            for (const product of products) {
                if (!product.name || !product.category || product.price === undefined) continue;
                const result = await supabaseService.createProduct({
                    ...product,
                    created_by: req.userId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                if (result.success) results.push(result.data);
            }
            return success(res, { imported: results.length, total: products.length }, `成功导入${results.length}条`);
        } catch (error) {
            logger.error('[ProductController] bulkImport error:', error);
            return error(res, '批量导入失败', 500);
        }
    }
};

export default productController;