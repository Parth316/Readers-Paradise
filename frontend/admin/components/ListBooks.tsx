import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});
  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/listBooks`);
        setBooks(response.data);
        // Initialize image indexes
        const indexes = response.data.reduce((acc: any, book: Book) => {
          acc[book._id] = 0;
          return acc;
        }, {});
        setCurrentImageIndexes(indexes);
      } catch (error) {
        setError('Error fetching books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const getImageUrl = (imagePath: string) => {
    const formattedPath = imagePath.replace(/\\/g, '/');
    return `${BACKEND_URL}/${formattedPath}`;
  };

  const handleNextImage = (bookId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [bookId]: (prev[bookId] + 1) % imagesLength
    }));
  };

  const handlePrevImage = (bookId: string, imagesLength: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [bookId]: (prev[bookId] - 1 + imagesLength) % imagesLength
    }));
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/deleteBook/${_id}`);
      setBooks(books.filter((book) => book._id !== _id));
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Error deleting book');
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-900">Explore Our Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            {/* Book Image Section with Slider */}
            <div className="relative w-full h-80">
              {book.images && book.images.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(book.images[currentImageIndexes[book._id]])}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-book.jpg';
                      target.onerror = null;
                    }}
                  />
                  {book.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(book._id, book.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => handleNextImage(book._id, book.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {book.images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndexes[book._id]
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Book Details Section */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-gray-700 line-clamp-3">{book.description}</p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Genre:</span> {book.genre}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Publisher:</span> {book.publisher}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Published Date:</span>{' '}
                  {new Date(book.published_date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Pages:</span> {book.pages}
                </p>
                <p className="text-xl font-bold text-blue-600">${book.price}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Quantity:</span> {book.qty}
                </p>
              </div>
              <button
                onClick={() => handleDelete(book._id)}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
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