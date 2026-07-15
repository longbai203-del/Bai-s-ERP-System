/**
 * @file order.routes.js
 * @description 订单路由
 * @module routes/order.routes
 */

import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', orderController.getList);
router.get('/stats', orderController.getStats);
router.get('/export', orderController.exportData);
router.get('/:id', orderController.getDetail);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);
router.patch('/:id/status', orderController.updateStatus);
router.post('/:id/cancel', orderController.cancel);

export default router;
