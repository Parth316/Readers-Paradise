// AllBooks.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";
import {API_URL} from "../utils/config"; 
interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  published_date: string;
  isbn?: string;
  image: string;
  images: string[];
}

const AllBooks: React.FC = () => {
  const { category } = useParams<{ category: string }>(); // Get category from URL
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<Book[]>(`${API_URL}/api/books/${category}`);
        setBooks(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setError(`Failed to fetch books for ${category}`);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center capitalize">
          {category?.replace(/([A-Z])/g, " $1")} Books
        </h1>
        {books.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 text-lg mb-4">No books found in this category.</p>
            <Link
              to="/home"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-amber-700 transition duration-300"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link key={book._id} to={`/books/${book._id}`}>
                <BookCard book={book} backendUrl={BACKEND_URL} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;