import { Router } from "express";
import { journalEntriesController } from "../controllers/JournalEntryController";

const router = Router();
const journalController = new journalEntriesController();

router.get('/user/:campaignId', (req, res) => journalController.getJournalEntriesByCampaignId(req, res));

router.post('/', (req, res) => journalController.createJournalEntry(req, res));

router.delete('/:id', (req, res) => journalController.deleteJournalEntry(req, res));

router.put('/:id', (req, res) => journalController.updateJournalEntry(req, res));

export default router;
