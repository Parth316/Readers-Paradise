import express from 'express';
import { getBooks,getBookById  } from '../controllers/bookController';
import {newArrivals } from '../controllers/userController';

const router = express.Router();
router.get('/',getBooks);
router.get('/newArrivals',newArrivals);
router.get('/:id', getBookById);
export default router;