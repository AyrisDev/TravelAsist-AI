import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateUser, logout);
router.get('/profile', authenticateUser, getProfile);

export default router;
