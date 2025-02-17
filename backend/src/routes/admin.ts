// backend/routes/admin.ts
import express from 'express';
import {addBooks,listBooks, deleteBook,updateBook} from '../controllers/adminController';
const router =express.Router();
router.post('/addBooks',addBooks);
router.get('/listBooks',listBooks);
router.delete('/deleteBook/:id',deleteBook);
router.put('/updateBook/:id',updateBook);
export default router;