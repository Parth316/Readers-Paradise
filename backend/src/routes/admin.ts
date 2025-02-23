// backend/routes/admin.ts
import express from 'express';
import {addBooks,listBooks, deleteBook,updateBook, listUsers} from '../controllers/adminController';
const router =express.Router();
router.post('/addBooks',addBooks);
router.get('/listBooks',listBooks);
router.delete('/deleteBook/:id',deleteBook);
router.put('/updateBook/:id',updateBook);
router.get('/listUsers',listUsers);
export default router;