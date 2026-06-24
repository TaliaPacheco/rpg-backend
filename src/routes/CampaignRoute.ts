import { Router } from 'express';
import type { Request, Response } from '../types/express';
import { CampaignController } from '../controllers/CampaignController';
import { CampaignInviteController } from '../controllers/CampaignInviteController';
import { validateSchema } from '../middleware/validateSchema';
import { createCampaignSchema, updateCampaignSchema } from '../schemas/campaingSchema';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();
const campaignController = new CampaignController();
const inviteController = new CampaignInviteController();

router.get('/mine', (req, res) => campaignController.getMyCampaigns(req, res));

router.get('/:id', (req, res) => campaignController.getCampaignById(req, res));

router.get('/:id/participants', (req, res) => campaignController.getParticipants(req, res));

router.get('/:id/invite-code', (req, res) => inviteController.getInviteCode(req, res));

router.post('/:id/invite-code/regenerate', (req, res) => inviteController.regenerateInviteCode(req, res));

router.post('/', validateSchema(createCampaignSchema), (req, res) => campaignController.createCampaign(req, res));

router.put('/:id', validateSchema(updateCampaignSchema), (req, res) => campaignController.updateCampaign(req, res));

router.post('/:id/upload-campaign-image', uploadMiddleware.single('campaignImage'), (req: Request, res: Response) => campaignController.uploadCampaignImage(req, res));

router.post('/:id/participants', (req, res) => campaignController.addParticipant(req, res));

router.delete('/:id/participants/:userId', (req, res) => campaignController.removeParticipant(req, res));

router.delete('/:id', (req, res) => campaignController.deleteCampaign(req, res));

export default router;