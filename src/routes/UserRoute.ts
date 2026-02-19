import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateSchema } from '../middleware/validateSchema';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';

const router = Router()
const userController = new UserController();

router.get('/', (req, res) => userController.listUsers(req, res))

router.post('/', validateSchema(createUserSchema), (req, res) => userController.createUser(req, res))

router.post('/login', validateSchema(loginUserSchema), (req, res) => userController.loginUser(req, res))

router.get('/:id', (req, res) => userController.getUserById(req, res))

export default router