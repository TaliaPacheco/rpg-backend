import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { validateSchema } from '../middleware/validateSchema';
import { createCampaignSchema } from '../schemas/campaingSchema';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();
const campaignController = new CampaignController();

router.get('/user/:userId', (req, res) => campaignController.getCampaignsByUserId(req, res));

router.post('/', validateSchema(createCampaignSchema), (req, res) => campaignController.createCampaign(req, res));

router.put('/:id', (req, res) => campaignController.updateCampaign(req, res));

router.post('/:id/upload-campaign-image', uploadMiddleware.single('campaignImage'), (req, res) => campaignController.uploadCampaignImage(req, res));

router.post('/:id/participants', (req, res) => campaignController.addParticipant(req, res));

router.delete('/:id/participants/:userId', (req, res) => campaignController.removeParticipant(req, res));

router.delete('/:id', (req, res) => campaignController.deleteCampaign(req, res));

export default router;