import { Request, Response } from "express";
import Book from "../models/Book";
import axios from "axios";

export const addBooks = async function(req: Request, res: Response):Promise<any> {
    try {
        const { title, author, isbn, description } = req.body;

        // Validate request body
        if (!title || !author || !isbn || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Create a new book instance
        const newBook = new Book({
            title,
            author,
            isbn,
            description,
            
        });

        // Save the book to the database
        const savedBook = await newBook.save();

        // Send a success response
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};