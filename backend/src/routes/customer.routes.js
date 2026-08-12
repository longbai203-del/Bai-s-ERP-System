/**
 * @file customer.routes.js
 * @description 客户路由
 * @module routes/customer.routes
 */

import express from 'express';
import { customerController } from '../controllers/customer.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', customerController.getList);
router.get('/stats', customerController.getStats);
router.get('/search', customerController.search);
router.get('/export', customerController.exportData);
router.get('/:id', customerController.getDetail);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);

export default router;
