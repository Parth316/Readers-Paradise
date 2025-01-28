//backend/controllers/bookController.ts
import { Request, Response } from 'express';
import Book from '../models/Book';
import axios from 'axios';
const BASE_URL = 'https://openlibrary.org';

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