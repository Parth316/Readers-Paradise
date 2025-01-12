import express from 'express';
import { getBooks } from '../controllers/bookController';

const router = express.Router();
router.get('/api/books',getBooks);

export default router;