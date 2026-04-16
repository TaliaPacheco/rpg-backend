import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { validateSchema } from '../middleware/validateSchema';
import { createInventoryItemSchema, updateInventoryItemSchema } from '../schemas/inventoryItemSchema';

const router = Router({ mergeParams: true });
const inventoryController = new InventoryController();

router.get('/', (req, res) => inventoryController.getItems(req, res));

router.post('/', validateSchema(createInventoryItemSchema), (req, res) => inventoryController.createItem(req, res));

router.put('/:id', validateSchema(updateInventoryItemSchema), (req, res) => inventoryController.updateItem(req, res));

router.delete('/:id', (req, res) => inventoryController.deleteItem(req, res));

export default router;
