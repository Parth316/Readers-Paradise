import { Request, Response } from "express";
import Book from "../models/Book";
import path from "path";
import multer from "multer";
import User from "../models/User";
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
        status:"New",
        date: Date.now()
      });
     
      
      // Save the book to the database
      const book = await Book.findOne({ isbn });
      if(book!==null){
        return res.status(400).json({ message: "Book already exists" });
      }
      
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
  try {
    const { id } = req.params;

    // Find the book by ID and delete it
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', deletedBook });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }};

export const updateBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate the data (optional)
    if (!updatedData.title || !updatedData.author || !updatedData.price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the book and update it
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    // Fetch all users
    const users = await User.find({});
    console.log(users);
    // Send a success response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getBookByIsbn = async (req: Request, res: Response): Promise<any> => {
  
    try {
      const book = await Book.findOne({ isbn: req.params.isbn });
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }

  export const updateBookQty = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const { qty } = req.body;
  
      
    
      if (!qty || isNaN(parseInt(qty, 10)) || parseInt(qty, 10) < 0) {
        res.status(400).json({ message: "Invalid quantity value" });
        return;
      }
  
      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }
  
      book.qty = qty;
      await book.save();
  
      res.status(200).json({ message: "Quantity updated successfully", book });
    } catch (error: any) {
      console.error("Error updating book quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };