import { Router } from 'express';
import { CustomerController } from '../controllers/Customer.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const customerController = new CustomerController();

router.get('/search', customerController.search.bind(customerController));
router.get('/email/:email', customerController.getByEmail.bind(customerController));
router.get('/code/:code', customerController.getByCode.bind(customerController));

router.use(authMiddleware);
router.get('/', customerController.getAll.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));
router.post('/', customerController.create.bind(customerController));
router.put('/:id', customerController.update.bind(customerController));
router.patch('/:id/balance', customerController.updateBalance.bind(customerController));
router.patch('/:id/toggle-status', customerController.toggleStatus.bind(customerController));
router.delete('/:id', customerController.delete.bind(customerController));

export default router;
