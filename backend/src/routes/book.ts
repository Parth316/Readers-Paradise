import express from 'express';
import { getBooks,getBookById,searchBooks } from '../controllers/bookController';
import {newArrivals } from '../controllers/userController';
import { addReview, getReviews } from "../controllers/reviewController";

const router = express.Router();
router.get('/',getBooks);
router.get('/newArrivals',newArrivals);
router.get('/search',searchBooks);
router.get("/:id/reviews", getReviews);
router.get('/:id', getBookById);
router.post("/:id/reviews", addReview); // Add a review for a book

export default router;