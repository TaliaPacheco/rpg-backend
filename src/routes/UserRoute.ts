import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateSchema } from '../middleware/validateSchema';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router()
const userController = new UserController();

router.get('/', (req, res) => userController.listUsers(req, res))

router.post('/', validateSchema(createUserSchema), (req, res) => userController.createUser(req, res))

router.post('/login', validateSchema(loginUserSchema), (req, res) => userController.loginUser(req, res))

router.get('/:id', (req, res) => userController.getUserById(req, res))

router.put('/:id', (req, res) => userController.updateUser(req, res))

router.post('/:id/upload-profile-image', uploadMiddleware.single('profileImage'), (req, res) => userController.uploadProfileImage(req, res))

router.delete('/:id', (req, res) => userController.deleteUser(req, res))

export default router