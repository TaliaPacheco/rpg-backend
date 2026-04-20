import { Router } from 'express';
import type { Request, Response } from '../types/express';
import { UserController } from '../controllers/UserController';
import { validateSchema } from '../middleware/validateSchema';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router()
const userController = new UserController();

router.post('/', validateSchema(createUserSchema), (req, res) => userController.createUser(req, res))

router.post('/login', validateSchema(loginUserSchema), (req, res) => userController.loginUser(req, res))

router.use(authMiddleware)

router.get('/:id', (req, res) => userController.getUserById(req, res))

router.put('/:id', (req, res) => userController.updateUser(req, res))

router.post('/:id/upload-profile-image', uploadMiddleware.single('profileImage'), (req: Request, res: Response) => userController.uploadProfileImage(req, res))

router.delete('/:id', (req, res) => userController.deleteUser(req, res))

export default router
