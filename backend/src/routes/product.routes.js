/**
 * @file product.routes.js
 * @description 商品路由
 * @module routes/product.routes
 */

import express from 'express';
import { productController } from '../controllers/product.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getList);
router.get('/categories', productController.getCategories);
router.get('/stats', productController.getStats);
router.get('/export', productController.exportData);
router.get('/search', productController.search);
router.get('/:id', productController.getDetail);
router.post('/', productController.create);
router.post('/bulk', productController.bulkImport);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
router.patch('/:id/stock', productController.updateStock);

export default router;
