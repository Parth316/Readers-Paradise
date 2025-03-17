//backend/models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  description: string;
  images: string[];
  qty: string;
  price: number;
  availabilty:boolean;
  genre:string;
  pages: number;
  publisher: string;
  published_date: Date;
  rating: number;
  reviews: number;
  status: string;
  date: Date;
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
  qty: { type: String, required: true },
  images:{type:[String],required:true},
  price: { type: Number, required: true },
  genre: { type: String, required: true },
  pages: { type: Number, required: true },
  publisher: { type: String, required: true },
  published_date: { type: Date, required: true },
  status: { type: String },
  date: { type: Date, default: Date.now },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;