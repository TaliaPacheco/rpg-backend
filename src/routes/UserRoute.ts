import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router()
const userontroller = new UserController();

router.get('/', (req, res) => userontroller.listUsers(req, res))

router.post('/', (req, res) => userontroller.createUser(req, res))

router.get('/:id', (req, res) => userontroller.getUserById(req, res))

export default router