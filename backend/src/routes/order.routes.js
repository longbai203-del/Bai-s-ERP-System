/**
 * 订单路由
 * 职责：路由定义 + 中间件挂载
 */
const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth');

const orderController = controllers.Order;

// 所有订单路由需要认证
router.use(authenticate);

// 订单操作
router.get('/', orderController.getAll.bind(orderController));
router.get('/stats', orderController.getStats.bind(orderController));
router.get('/:id', orderController.getById.bind(orderController));
router.post('/', orderController.create.bind(orderController));
router.put('/:id/status', orderController.updateStatus.bind(orderController));
router.post('/:id/cancel', orderController.cancel.bind(orderController));

// 客户订单查询
router.get('/customer/:customerId', orderController.getByCustomer.bind(orderController));

module.exports = router;
