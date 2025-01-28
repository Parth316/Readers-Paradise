// backend/routes/admin.ts
import express from 'express';
import {addBooks } from '../controllers/adminController';
const router =express.Router();
router.post('/addBooks',addBooks);

export default router;