import { Router } from 'express';
import { SpellController } from '../controllers/SpellController';
import { validateSchema } from '../middleware/validateSchema';
import { createSpellSchema, updateSpellSchema } from '../schemas/spellSchema';

const router = Router({ mergeParams: true });
const spellController = new SpellController();

router.get('/', (req, res) => spellController.getSpells(req, res));

router.post('/', validateSchema(createSpellSchema), (req, res) => spellController.createSpell(req, res));

router.put('/:id', validateSchema(updateSpellSchema), (req, res) => spellController.updateSpell(req, res));

router.delete('/:id', (req, res) => spellController.deleteSpell(req, res));

export default router;
