import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { validateSchema } from '../middleware/validateSchema';
import { createCampaignSchema } from '../schemas/campaingSchema';

const router = Router();
const campaignController = new CampaignController();

router.get('/user/:userId', (req, res) => campaignController.getCampaignsByUserId(req, res));

router.post('/', validateSchema(createCampaignSchema), (req, res) => campaignController.createCampaign(req, res));

router.put('/:id', (req, res) => campaignController.updateCampaign(req, res));

router.delete('/:id', (req, res) => campaignController.deleteCampaign(req, res));

export default router;