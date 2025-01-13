import React, { useState } from "react";
import axios from "axios";

const BookList: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const limit = 5;

  const fetchBooks = async () => {
    if (!query.trim()) {
      return;
    }
    console.log(query);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/books`, {
        params: { q: query }
      });
      console.log("Data " + response.data);
      if (response.data && response.data.docs) {
        setBooks(response.data.docs);
        // setTotalPages(Math.ceil(response.data.numFound / limit));
      } else {
        setBooks([]);
        // setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };
  // Handle search and reset page to 1
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBooks();
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchBooks();
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchBooks();
    }
  };

  return (
    <div className="w-full max-w-xl  rounded-lg shadow-lg">
      {/* Search Bar */}
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-r-full hover:bg-yellow-700 transition"
        >
          Search 
        </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="ms-3 flex items-center justify-center my-2">
          <div className="w-5 h-5 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      </div>

      {/* Book List */}
      {!loading && books.length > 0 && (
        <ul className="space-y-2">
          {books.map((book, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              <h3 className="text-md font-bold text-emerald-700">{book.title}</h3>
              <p className="text-gray-600">
                <strong>Author:</strong> {book.author_name ? book.author_name.join(", ") : "Unknown"}
              </p>
              <p className="text-gray-600">
                <strong>Published:</strong> {book.first_publish_year || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {!loading && books.length === 0 && !error && query.trim() && (
        <p className="text-gray-600 mt-2 text-center">
          No results found for "<span className="font-semibold">{query}</span>".
        </p>
      )}

      {/* Pagination Controls */}
      {!loading && books.length > 0 && (
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;