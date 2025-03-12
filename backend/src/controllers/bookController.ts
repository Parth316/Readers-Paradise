//backend/controllers/bookController.ts
import { Request, Response } from 'express';
import Book from '../models/Book';
import axios from 'axios';
const BASE_URL = 'https://openlibrary.org';
import Review from "../models/Review";
import { validationResult } from "express-validator";

export const getBooks = async (req: Request, res: Response):Promise<any>=> {
    const query = req.query.q as string ;
    console.log("Query : "+query);
    try {
        const books  = await fetchBooks(query);
        console.log(books); 
        return res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchQuery = req.query.q as string;
  
      if (!searchQuery || searchQuery.trim() === '') {
        res.status(200).json([]);
        return;
      }
  
      const searchRegex = new RegExp(searchQuery.trim(), 'i'); // Case-insensitive search
  
      const books = await Book.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
        ],
      })
        .limit(50) // Limit results
        .select('title description author publicationYear'); // Select specific fields
  
      // Transform the results to match your frontend interface
      const formattedBooks = books.map(book => ({
        id: book.id.toString(),
        title: book.title,
        description: book.description,
        author: book.author,
        publication_year: book.published_date,
      }));
      console.log("Formatted Books : "+formattedBooks);
      res.status(200).json(formattedBooks);
    } catch (error) {
      console.error('Error searching books:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
const fetchBooks = async (query: string) => {
    try {
        console.log("Hi from fetchBooks function");
        const response = await axios.get(`${BASE_URL}/search.json`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching books from Open Library API');
    }
};

export const getBookById =async (req: Request, res: Response):Promise<any> => {
    
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};


// Add a review to a book
export const addReview = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

    // Optionally, update the book's average rating (if you want to implement this feature)
    // You can calculate the average rating and update the book document.

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

