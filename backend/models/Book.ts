//backend/models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  description: string;
  image: string;
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;