import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Review from "../models/Review";
import Book from "../models/Book";


// Add a review to a book
export const addReview = async (req: Request, res: Response):Promise<any>=> {
  const { bookId } = req.params;
  const { user, rating, comment } = req.body;

  try {
    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {    
      return res.status(404).json({ message: "Book not found" });
    }

    // Create a new review
    const review = new Review({
      book: bookId,
      user,
      rating,
      comment,
    });

    // Save the review
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reviews for a book
export const getReviews = async (req: Request, res: Response) => {
  const { bookId } = req.params;

  try {
    const reviews = await Review.find({ book: bookId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};