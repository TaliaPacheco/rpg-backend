import { Router } from "express";
import { CharactersController } from "../controllers/CharacterController";
import { validateSchema } from "../middleware/validateSchema";
import { createCharacterSchema, updateCharacterSchema } from "../schemas/characterSchema";

const router = Router();
const charactersController = new CharactersController();

router.get('/campaign/:campaignId', (req, res) => charactersController.getCharactersByCampaignId(req, res));

router.post('/', validateSchema(createCharacterSchema), (req, res) => charactersController.createCharacter(req, res));

router.put('/:id', validateSchema(updateCharacterSchema), (req, res) => charactersController.updateCharacter(req, res));

router.delete('/:id', (req, res) => charactersController.deleteCharacter(req, res));

import inventoryRoutes from './InventoryRoute';

router.use('/:characterId/inventory', inventoryRoutes);

export default router;
