import { Router } from 'express';
import { ProductController } from '../controllers/Product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const productController = new ProductController();

router.get('/search', productController.search.bind(productController));
router.get('/low-stock', productController.getLowStock.bind(productController));
router.get('/category-stats', productController.getCategoryStats.bind(productController));
router.get('/category/:category', productController.getByCategory.bind(productController));
router.get('/code/:code', productController.getByCode.bind(productController));

router.use(authMiddleware);
router.get('/', productController.getAll.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.post('/', productController.create.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.patch('/:id/stock', productController.updateStock.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

export default router;
