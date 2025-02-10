import { Request, Response } from "express";
import Book from "../models/Book";
import axios from "axios";

export const addBooks = async function(req: Request, res: Response):Promise<any> {
    try {
        const { title, author, isbn, description, qty} = req.body;
        console.log(req.body);

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
            qty,
            
        });

        // Save the book to the database
        const savedBook = await newBook.save();

        // Send a success responses
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error " });
    }
};

export const listBooks=async function(req:Request,res:Response):Promise<any>{
    try{
        const books=await Book.find({});
        res.status(200).json(books);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
}

export const deleteBook = async (req: Request, res: Response): Promise<any>=> {
        console.log("delete Book ", req.body);
}