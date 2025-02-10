import express from 'express';
import { getBooks } from '../controllers/bookController';
import { listBooks } from '../controllers/adminController';

const router = express.Router();
router.get('/',getBooks);

export default router;