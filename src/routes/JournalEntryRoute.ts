import { Router } from "express";
import { journalEntriesController } from "../controllers/JournalEntryController";
import { validateSchema } from "../middleware/validateSchema";
import { createJournalSchema, updateJournalSchema } from "../schemas/JournalSchema";

const router = Router();
const journalController = new journalEntriesController();

router.get('/campaign/:campaignId', (req, res) => journalController.getJournalEntriesByCampaignId(req, res));

router.get('/:id', (req, res) => journalController.getJournalEntryById(req, res));

router.post('/', validateSchema(createJournalSchema), (req, res) => journalController.createJournalEntry(req, res));

router.delete('/:id', (req, res) => journalController.deleteJournalEntry(req, res));

router.put('/:id', validateSchema(updateJournalSchema), (req, res) => journalController.updateJournalEntry(req, res));

export default router;
