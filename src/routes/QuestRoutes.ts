import { Router } from 'express';
import { QuestsController } from '../controllers/QuestController';

const router = Router();
const questsController = new QuestsController();

router.get('/user/:userId', (req, res) => questsController.getQuestsByUserId(req, res));

router.post('/', (req, res) => questsController.createQuest(req, res));

router.delete('/:id', (req, res) => questsController.deleteQuest(req, res));

router.put('/:id', (req, res) => questsController.updateQuest(req, res));

export default router;