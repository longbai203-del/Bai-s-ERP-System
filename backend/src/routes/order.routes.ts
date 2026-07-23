import { Router } from 'express';
import { OrderController } from '../controllers/Order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const orderController = new OrderController();

// 公开路由
router.get('/statistics', orderController.getStatistics.bind(orderController));
router.get('/status/:status', orderController.getByStatus.bind(orderController));
router.get('/customer/:customerId', orderController.getByCustomer.bind(orderController));

// 需要认证的路由
router.use(authMiddleware);
router.get('/', orderController.getAll.bind(orderController));
router.get('/:id', orderController.getById.bind(orderController));
router.get('/number/:orderNo', orderController.getByOrderNo.bind(orderController));
router.post('/', orderController.create.bind(orderController));
router.put('/:id', orderController.update.bind(orderController));
router.patch('/:id/status', orderController.updateStatus.bind(orderController));
router.patch('/:id/cancel', orderController.cancelOrder.bind(orderController));
router.delete('/:id', orderController.delete.bind(orderController));

export default router;
