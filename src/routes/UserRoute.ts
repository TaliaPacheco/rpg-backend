import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router()
const userController = new UserController();

router.get('/', (req, res) => userController.listUsers(req, res))

router.post('/', (req, res) => userController.createUser(req, res))

router.post('/login', (req, res) => userController.loginUser(req, res))

router.get('/:id', (req, res) => userController.getUserById(req, res))

export default router