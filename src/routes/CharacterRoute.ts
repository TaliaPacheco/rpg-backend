import { Router } from "express";
import { CharactersController } from "../controllers/CharacterController";
import { validateSchema } from "../middleware/validateSchema";
import { createCharacterSchema } from "../schemas/characterSchema";

const router = Router();
const charactersController = new CharactersController();

router.get('/campaign/:campaignId', (req, res) => charactersController.getCharactersByCampaignId(req, res));

router.post('/', validateSchema(createCharacterSchema), (req, res) => charactersController.createCharacter(req, res));

router.delete('/:id', (req, res) => charactersController.deleteCharacter(req, res));

export default router;