/**
 * 产品路由
 * 职责：路由定义 + 中间件挂载
 */
const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth');

const productController = controllers.Product;

// 公开路由（产品查询）
router.get('/', productController.getAll.bind(productController));
router.get('/search', productController.search.bind(productController));
router.get('/low-stock', productController.getLowStock.bind(productController));
router.get('/stats', productController.getStats.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// 需要认证的路由
router.use(authenticate);

// 管理操作
router.use(authorize('admin'));
router.post('/', productController.create.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));
router.put('/:id/stock', productController.updateStock.bind(productController));

module.exports = router;
