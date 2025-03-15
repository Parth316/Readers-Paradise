import { Request, Response } from 'express';
import Book from '../models/Book';
export const newArrivals = async (req: Request, res: Response): Promise<any> => {
    try {
      const books = await Book.find({genre:"New Arrivals"});
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const fetchBooksByCategory = async (req: Request, res: Response): Promise<any> => {
    try {
      const books = await Book.find({genre:"Best Sellers"});
      console.log(books);
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
