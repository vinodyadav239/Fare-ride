import { Router } from 'express';
import { login, register, getUsers } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/users', getUsers);

export default router;
