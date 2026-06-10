import { Router } from 'express';
import { QuestsController } from '../controllers/QuestController';
import { validateSchema } from '../middleware/validateSchema';
import { createQuestSchema, updateQuestSchema } from '../schemas/questSchema';

const router = Router();
const questsController = new QuestsController();

router.get('/campaign/:campaignId', (req, res) => questsController.getQuestsByCampaignId(req, res));

router.post('/', validateSchema(createQuestSchema), (req, res) => questsController.createQuest(req, res));

router.get('/:id', (req, res) => questsController.getQuestById(req, res));

router.delete('/:id', (req, res) => questsController.deleteQuest(req, res));

router.put('/:id', validateSchema(updateQuestSchema), (req, res) => questsController.updateQuest(req, res));

export default router;