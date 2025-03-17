import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react"; // Import the warning icon from lucide-react
import axios from "axios";
import { toast } from "react-toastify";

// Define the Book interface based on the backend model
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

const Inventory: React.FC = () => {
  const navigate = useNavigate();

  // State for books, search, sort, pagination, and quantity update
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("qtyAsc"); // Default: sort by quantity low to high
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage] = useState<number>(10); // 10 books per page
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newQty, setNewQty] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch books from /api/admin/listBooks
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Book[]>("http://localhost:5000/api/admin/listBooks");
        setBooks(response.data);
      } catch (err: any) {
        console.error("Error fetching books:", err);
        setError(err.response?.data?.message || "Failed to fetch books.");
        toast.error(error || "Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter and sort books
  const filteredBooks = books
    .filter((book: Book) =>
      searchTerm
        ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a: Book, b: Book) => {
      const qtyA = parseInt(a.qty, 10);
      const qtyB = parseInt(b.qty, 10);
      const priceA = a.price;
      const priceB = b.price;

      switch (sortBy) {
        case "qtyAsc":
          return qtyA - qtyB;
        case "qtyDesc":
          return qtyB - qtyA;
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "titleDesc":
          return b.title.localeCompare(a.title);
        case "priceAsc":
          return priceA - priceB;
        case "priceDesc":
          return priceB - priceA;
        default:
          return qtyA - qtyB;
      }
    });

  // Pagination logic
  const totalBooks = filteredBooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  // Handle quantity update
  const handleUpdateQty = async (bookId: string) => {
    if (!newQty || isNaN(parseInt(newQty, 10)) || parseInt(newQty, 10) < 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/updateBookQty/${bookId}`,
        { qty: newQty }
        // Removed Authorization header since it's not needed
      );

      toast.success("Quantity updated successfully!");
      const response = await axios.get<Book[]>("http://localhost:5000/api/admin/listBooks");
      setBooks(response.data);
      setSelectedBook(null);
      setNewQty("");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update quantity.";
      console.error("Update quantity error:", err.response?.data);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Pagination navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Inventory Management</h1>

        {/* Search and Sort Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-gray-700 font-medium mb-1">
              Search Books
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by title, author, or ISBN..."
            />
          </div>

          {/* Sort */}
          <div className="flex-1">
            <label htmlFor="sort" className="block text-gray-700 font-medium mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset to first page on sort
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="qtyAsc">Quantity: Low to High</option>
              <option value="qtyDesc">Quantity: High to Low</option>
              <option value="titleAsc">Title: A to Z</option>
              <option value="titleDesc">Title: Z to A</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Books Inventory</h2>
          {paginatedBooks.length === 0 ? (
            <p className="text-gray-600">No books found. {error && `(Error: ${error})`}</p>
          ) : (
            <ul className="space-y-4">
              {paginatedBooks.map((book: Book) => {
                const qty = parseInt(book.qty, 10);
                const isLowStock = qty < 10; // Warning for quantity < 10
                const backendUrl = "http://localhost:5000"; // Adjust based on your backend URL
                const imageUrl =
                  book.images && book.images[0]
                    ? book.images[0].startsWith("http")
                      ? book.images[0]
                      : `${backendUrl}/${book.images[0]}`
                    : "https://via.placeholder.com/50";

                return (
                  <li
                    key={book._id}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      isLowStock ? "bg-red-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={imageUrl}
                        alt={book.title}
                        className="w-16 h-16 object-contain rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/50";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{book.title}</p>
                        <p className="text-gray-600">by {book.author}</p>
                        <p className="text-gray-600">ISBN: {book.isbn}</p>
                        <p className="text-gray-600">Price: ${book.price.toFixed(2)}</p>
                        <p className="text-gray-600">
                          Quantity: {book.qty}
                          {isLowStock && (
                            <span className="ml-2 flex items-center text-red-600">
                              <AlertTriangle size={16} />
                              <span className="ml-1">Low Stock</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setNewQty(book.qty);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Update Quantity
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Update Quantity Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Update Quantity for {selectedBook.title}
              </h3>
              <div className="mb-4">
                <label htmlFor="newQty" className="block text-gray-700 font-medium mb-1">
                  New Quantity
                </label>
                <input
                  type="number"
                  id="newQty"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new quantity"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    setNewQty("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateQty(selectedBook._id)}
                  disabled={isUpdating}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;