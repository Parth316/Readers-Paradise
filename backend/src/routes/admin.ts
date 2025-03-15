// backend/routes/admin.ts
import express from 'express';
import {addBooks,listBooks, deleteBook,updateBook, listUsers, getBookByIsbn} from '../controllers/adminController';
import {getOrders} from '../controllers/orderController'
const router =express.Router();
router.get("/",);
router.post('/addBooks',addBooks);
router.get('/listBooks',listBooks);
router.get('/listOrders',getOrders);
router.delete('/deleteBook/:id',deleteBook);
router.put('/updateBook/:id',updateBook);
router.get('/listUsers',listUsers);
router.get('/isbn/:isbn',getBookByIsbn);
export default router;