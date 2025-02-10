import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  qty: number;
}

const ListBooks:React.FC<Book>=()=> {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/listBooks');
        setBooks(response.data);
      } catch (error) {
        setError('Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (_id: number) => {
    console.log(books);
    console.log('deleting book with id:', _id);
    try {
      
      console.log(_id);
      await axios.delete('http://localhost:5173/api/admin/deleteBook');
      setBooks(books.filter(book => book.id !==_id));
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Error deleting book');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-700 mt-2">{book.description}</p>
            </div>
            <p className="text-green-600 font-bold mt-2">Quantity: {book.qty}</p>
            {/* <button
              onClick={() => handleDelete(book._id)}
              className="w-32 text-lg md:text-xl bg-red-600 text-white py-2 rounded-full border-2 border-red-600 hover:bg-red-700 transition duration-300"
            >
              Delete
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListBooks;