/**
 * @file products.routes.js
 * @description 商品路由
 * @module routes/products.routes
 */

import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 所有商品路由需要认证
router.use(authMiddleware);

/**
 * @route GET /api/products
 * @description 获取商品列表
 * @access Private
 */
router.get('/', productController.getList);

/**
 * @route GET /api/products/categories
 * @description 获取分类列表
 * @access Private
 */
router.get('/categories', productController.getCategories);

/**
 * @route GET /api/products/stats
 * @description 获取商品统计
 * @access Private
 */
router.get('/stats', productController.getStats);

/**
 * @route GET /api/products/export
 * @description 导出商品数据
 * @access Private
 */
router.get('/export', productController.exportData);

/**
 * @route GET /api/products/search
 * @description 搜索商品
 * @access Private
 */
router.get('/search', productController.search);

/**
 * @route GET /api/products/:id
 * @description 获取商品详情
 * @access Private
 */
router.get('/:id', productController.getDetail);

/**
 * @route POST /api/products
 * @description 创建商品
 * @access Private
 */
router.post('/', productController.create);

/**
 * @route POST /api/products/bulk
 * @description 批量导入商品
 * @access Private
 */
router.post('/bulk', productController.bulkImport);

/**
 * @route PUT /api/products/:id
 * @description 更新商品
 * @access Private
 */
router.put('/:id', productController.update);

/**
 * @route DELETE /api/products/:id
 * @description 删除商品
 * @access Private
 */
router.delete('/:id', productController.delete);

/**
 * @route PATCH /api/products/:id/stock
 * @description 更新商品库存
 * @access Private
 */
router.patch('/:id/stock', productController.updateStock);

export default router;