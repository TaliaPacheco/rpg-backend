import { Router } from "express";
import { CharactersController } from "../controllers/CharacterController";
import { validateSchema } from "../middleware/validateSchema";
import { createCharacterSchema, updateCharacterSchema } from "../schemas/characterSchema";
import inventoryRoutes from './InventoryRoute';
import spellRoutes from './SpellRoute';

const router = Router();
const charactersController = new CharactersController();

router.get('/campaign/:campaignId', (req, res) => charactersController.getCharactersByCampaignId(req, res));

router.get('/mine', (req, res) => charactersController.getMyCharacters(req, res));

router.get('/:id', (req, res) => charactersController.getCharacterById(req, res));

router.post('/', validateSchema(createCharacterSchema), (req, res) => charactersController.createCharacter(req, res));

router.put('/:id', validateSchema(updateCharacterSchema), (req, res) => charactersController.updateCharacter(req, res));

router.delete('/:id', (req, res) => charactersController.deleteCharacter(req, res));

router.use('/:characterId/inventory', inventoryRoutes);
router.use('/:characterId/spells', spellRoutes);

export default router;
