// reviewController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Review from "../models/Review";
import Book from "../models/Book";

export const addReview = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { user, rating, comment } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = await Review.findOne({ book: id, user });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book" });
    }

    const review = new Review({
      book: id,
      user,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ book: id }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// New edit review controller
export const editReview = async (req: Request, res: Response):Promise<any> => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.body.user; // Assuming user ID comes from auth middleware or request

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user !== userId) {
      return res.status(403).json({ message: "You can only edit your own reviews" });
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = new Date();

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Server error" });
  }
};