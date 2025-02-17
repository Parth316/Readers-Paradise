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
  const [editingBook, setEditingBook] = useState<Book | null>(null); // Track the book being edited
  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/listBooks`);
        setBooks(response.data);
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

  const handleEdit = (book: Book) => {
    setEditingBook(book); // Open the edit modal/form
  };

  const handleSaveEdit = async (updatedBook: Book) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/updateBook/${updatedBook._id}`, updatedBook);
      setBooks(books.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
      setEditingBook(null); // Close the edit modal/form
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Error updating book');
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
            className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 hover:scale-105"
          >
            {/* Details Section */}
            <div className="p-6 flex-1 space-y-4">
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
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(book)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-80">
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
          </div>
        ))}

        {/* Edit Modal */}
        {editingBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedBook = {
                    _id: editingBook._id,
                    title: formData.get('title') as string,
                    author: formData.get('author') as string,
                    description: formData.get('description') as string,
                    qty: parseInt(formData.get('qty') as string),
                    genre: formData.get('genre') as string,
                    publisher: formData.get('publisher') as string,
                    published_date: formData.get('published_date') as string,
                    pages: parseInt(formData.get('pages') as string),
                    price: parseFloat(formData.get('price') as string),
                    images: editingBook.images, // Keep images unchanged for simplicity
                  };
                  handleSaveEdit(updatedBook);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingBook.title}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    required
                  />
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingBook.author}
                    className="w-full p-2 border rounded"
                    placeholder="Author"
                    required
                  />
                  <textarea
                    name="description"
                    defaultValue={editingBook.description}
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                    rows={3}
                    required
                  />
                  <input
                    type="number"
                    name="qty"
                    defaultValue={editingBook.qty}
                    className="w-full p-2 border rounded"
                    placeholder="Quantity"
                    required
                  />
                  <input
                    type="text"
                    name="genre"
                    defaultValue={editingBook.genre}
                    className="w-full p-2 border rounded"
                    placeholder="Genre"
                    required
                  />
                  <input
                    type="text"
                    name="publisher"
                    defaultValue={editingBook.publisher}
                    className="w-full p-2 border rounded"
                    placeholder="Publisher"
                    required
                  />
                  <input
                    type="date"
                    name="published_date"
                    defaultValue={editingBook.published_date.split('T')[0]}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    name="pages"
                    defaultValue={editingBook.pages}
                    className="w-full p-2 border rounded"
                    placeholder="Pages"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editingBook.price}
                    className="w-full p-2 border rounded"
                    placeholder="Price"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBooks;