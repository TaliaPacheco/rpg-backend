import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';

const router = Router();
const campaignController = new CampaignController();

router.get('/user/:userId', (req, res) => campaignController.getCampaignsByUserId(req, res));

router.post('/', (req, res) => campaignController.createCampaign(req, res));

router.delete('/:id', (req, res) => campaignController.deleteCampaign(req, res));

export default router;