import { Router } from 'express';
import { TransactionController, AccountController } from '../controllers/Finance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const transactionController = new TransactionController();
const accountController = new AccountController();

// 交易路由
router.get('/transactions/summary', transactionController.getSummary.bind(transactionController));
router.get('/transactions/date-range', transactionController.getByDateRange.bind(transactionController));
router.get('/transactions/no/:no', transactionController.getByNo.bind(transactionController));

router.use(authMiddleware);
router.get('/transactions', transactionController.getAll.bind(transactionController));
router.get('/transactions/:id', transactionController.getById.bind(transactionController));
router.post('/transactions', transactionController.create.bind(transactionController));
router.put('/transactions/:id', transactionController.update.bind(transactionController));
router.patch('/transactions/:id/approve', transactionController.approve.bind(transactionController));
router.patch('/transactions/:id/cancel', transactionController.cancel.bind(transactionController));
router.delete('/transactions/:id', transactionController.delete.bind(transactionController));

// 账户路由
router.get('/accounts', accountController.getAll.bind(accountController));
router.get('/accounts/balance-summary', accountController.getBalanceSummary.bind(accountController));
router.get('/accounts/:id', accountController.getById.bind(accountController));
router.get('/accounts/code/:code', accountController.getByCode.bind(accountController));
router.post('/accounts', accountController.create.bind(accountController));
router.put('/accounts/:id', accountController.update.bind(accountController));
router.delete('/accounts/:id', accountController.delete.bind(accountController));

export default router;
