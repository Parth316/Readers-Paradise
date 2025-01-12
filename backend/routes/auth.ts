// auth.ts --backend/routes/auth.ts
import express from 'express';
import { login,register } from '../controllers/authController';
const router =express.Router();
router.post('/signup', register);
router.post('/login',login);

export default router;