import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  qty: number;
  genre: string;
  publisher: string;
  published_date: string;
  pages: number;
  price: number;
  images: string[];
}

const ListBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/listBooks');
        console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        setError('Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/deleteBook/${_id}`);
      setBooks(books.filter((book) => book._id !== _id));
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Error deleting book');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Books List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Book Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={book.images[0]} // Display the first image
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Book Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Author:</span> {book.author}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Genre:</span> {book.genre}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Publisher:</span> {book.publisher}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Published Date:</span> {new Date(book.published_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Pages:</span> {book.pages}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Price:</span> ${book.price}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Quantity:</span> {book.qty}
              </p>
              <p className="text-gray-700 mb-4">{book.description}</p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(book._id)}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBooks;