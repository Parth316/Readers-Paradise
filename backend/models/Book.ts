// models/book.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the book document
interface IBook extends Document {
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i: number;
}

// Create the schema
const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author_name: { type: [String], required: true },
    first_publish_year: { type: Number, required: true },
    cover_i: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create the model from the schema
const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
