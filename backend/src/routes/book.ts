import express from 'express';
import { getBooks,getBookById,searchBooks } from '../controllers/bookController';
import {fetchBooksByCategory, newArrivals } from '../controllers/userController';
import { addReview, getReviews, editReview} from "../controllers/reviewController";

const router = express.Router();
router.get('/',getBooks);
router.get('/newArrivals',newArrivals);
router.get('/bestSellers',fetchBooksByCategory);
router.get('/search',searchBooks);
router.get("/:id/fetchReviews", getReviews);
router.get('/:id', getBookById);
router.put("/reviews/:reviewId", editReview);
router.post("/:id/addReview", addReview); // Add a review for a book

export default router;