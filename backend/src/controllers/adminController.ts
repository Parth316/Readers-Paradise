import { Request, Response } from "express";
import Book from "../models/Book";
import path from "path";
import multer from "multer";

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array('images', 10); // Allow up to 10 images

// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images Only!'));
  }
}

export const addBooks = async (req: Request, res: Response): Promise<any> => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, author, isbn, description, qty, pages, publisher, published_date, genre, price } = req.body;

      // Validate request body
      if (!title || !author || !isbn || !description || !qty || !pages || !publisher || !published_date || !genre || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Ensure req.files is an array of files
      const files = req.files as Express.Multer.File[];

      // Create a new book instance
      const newBook = new Book({
        title,
        author,
        isbn,
        description,
        qty,
        images: files.map((file) => file.path),
        pages,
        publisher,
        published_date,
        price,
        genre,

      });

      // Save the book to the database
      const savedBook = await newBook.save();

      // Send a success response
      res.status(201).json(savedBook);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

export const listBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<any> => {
  console.log("delete Book ", req.body);
};