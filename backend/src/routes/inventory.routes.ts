import { Router } from 'express';
import { InventoryController } from '../controllers/Inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

// CRUD 路由
router.get('/', (req, res) => inventoryController.getAll(req, res));
router.get('/search', (req, res) => inventoryController.search(req, res));
router.get('/:id', (req, res) => inventoryController.getById(req, res));
router.get('/code/:code', (req, res) => inventoryController.getByCode(req, res));
router.post('/', (req, res) => inventoryController.create(req, res));
router.put('/:id', (req, res) => inventoryController.update(req, res));
router.patch('/:id/stock', (req, res) => inventoryController.updateStock(req, res));
router.delete('/:id', (req, res) => inventoryController.delete(req, res));

export default router;
