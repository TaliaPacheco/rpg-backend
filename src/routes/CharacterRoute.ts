import { Router } from "express";
import { CharactersController } from "../controllers/CharacterController";

const router = Router();
const charactersController = new CharactersController();

router.get('/campaign/:campaignId', (req, res) => charactersController.getCharactersByCampaignId(req, res));

router.post('/', (req, res) => charactersController.createCharacter(req, res));

router.delete('/:id', (req, res) => charactersController.deleteCharacter(req, res));

export default router;