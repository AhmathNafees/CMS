// routes/auth.js
import express from 'express';
import { login, verify } from '../controllers/authController.js';
import { refreshTokenController } from '../controllers/refreshController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);
router.post('/refresh', refreshTokenController);

export default router;
