import { Router } from "express";
import { journalEntriesController } from "../controllers/JournalEntryController";
import { validateSchema } from "../middleware/validateSchema";
import { createJournalSchema } from "../schemas/JournalSchema";

const router = Router();
const journalController = new journalEntriesController();

router.get('/user/:campaignId', (req, res) => journalController.getJournalEntriesByCampaignId(req, res));

router.post('/', validateSchema(createJournalSchema), (req, res) => journalController.createJournalEntry(req, res));

router.delete('/:id', (req, res) => journalController.deleteJournalEntry(req, res));

router.put('/:id', (req, res) => journalController.updateJournalEntry(req, res));

export default router;
