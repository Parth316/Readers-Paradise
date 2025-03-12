// backend/routes/auth.ts
import express from 'express';
import { login,register } from '../controllers/authController';
import { sendPasswordResetCode,resetPassword } from "../controllers/authController";

const router =express.Router();
router.post('/signup', register);
router.post('/login',login);
router.post("/forgotPassword", sendPasswordResetCode);
router.post("/resetPassword", resetPassword); // New route


export default router;