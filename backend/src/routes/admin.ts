// backend/routes/admin.ts
import express from 'express';
import {addBooks,listBooks, deleteBook} from '../controllers/adminController';
const router =express.Router();
router.post('/addBooks',addBooks);
router.get('/listBooks',listBooks);
router.post('/deleteBook',deleteBook);
export default router;