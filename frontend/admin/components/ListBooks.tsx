import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { showDeleteWarning } from "./Warning";
import NotFound from "./NotFound";
import { ErrorBoundary } from 'react-error-boundary';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
    const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number; }>({});
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const BACKEND_URL = "http://localhost:5000";
    const notFoundImage = "/images/nobookfound.png";

    const fetchBooks = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/admin/listBooks`);
            setBooks(response.data);
            const indexes = response.data.reduce((acc: { [key: string]: number; }, book: Book) => {
                acc[book._id] = 0;
                return acc;
            }, {});
            setCurrentImageIndexes(indexes);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error fetching books:", err.message);
            setError(`Failed to fetch books: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [BACKEND_URL]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return notFoundImage;
        const formattedPath = imagePath.replace(/\\/g, "/");
        return `${BACKEND_URL}/${formattedPath}`;
    };

    const handleNextImage = (bookId: string, imagesLength: number) => {
        setCurrentImageIndexes((prev) => ({
            ...prev,
            [bookId]: (prev[bookId] + 1) % imagesLength,
        }));
    };

    const handlePrevImage = (bookId: string, imagesLength: number) => {
        setCurrentImageIndexes((prev) => ({
            ...prev,
            [bookId]: (prev[bookId] - 1 + imagesLength) % imagesLength,
        }));
    };

    const handleDelete = async (_id: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/admin/deleteBook/${_id}`);
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== _id));
        } catch (err) {
            console.error("Error deleting book:", err.message);
            setError(`Failed to delete book: ${err.message}`);
        }
    };

    const handleEdit = (book: Book) => {
        setEditingBook(book);
    };

    const handleSaveEdit = async (updatedBook: Book) => {
        try {
            await axios.put(`${BACKEND_URL}/api/admin/updateBook/${updatedBook._id}`, updatedBook);
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book._id === updatedBook._id ? updatedBook : book))
            );
            setEditingBook(null);
        } catch (err) {
            console.error("Error updating book:", err.message);
            setError(`Failed to update book: ${err.message}`);
        }
    };

    const renderBookDetails = (book: Book) => (
        <div className="space-y-2">
            <p className="text-gray-700">
                <span className="font-semibold">Genre:</span> {book.genre}
            </p>
            <p className="text-gray-700">
                <span className="font-semibold">Publisher:</span> {book.publisher}
            </p>
            <p className="text-gray-700">
                <span className="font-semibold">Published Date:</span> {new Date(book.published_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
                <span className="font-semibold">Pages:</span> {book.pages}
            </p>
            <p className="text-xl font-bold text-blue-600">
                ${book.price}
            </p>
            <p className="text-gray-700">
                <span className="font-semibold">Quantity:</span> {book.qty}
            </p>
        </div>
    );

    const renderBookImage = (book: Book) => (
        <div className={`relative ${layout === "grid" ? "w-full h-80" : "w-full md:w-1/3 h-80 flex-shrink-0"}`}>
            {book.images && book.images.length > 0 ? (
                <>
                    <img
                        src={getImageUrl(book.images[currentImageIndexes[book._id]])}
                        alt={`Cover of ${book.title} by ${book.author}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = notFoundImage;
                            target.onerror = null;
                        }}
                    />
                    {book.images.length > 1 && (
                        <>
                            <button
                                aria-label="Previous image"
                                onClick={() => handlePrevImage(book._id, book.images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                aria-label="Next image"
                                onClick={() => handleNextImage(book._id, book.images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            >
                                <ChevronRight size={20} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {book.images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full ${index === currentImageIndexes[book._id] ? "bg-blue-500" : "bg-gray-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <img src={notFoundImage} alt="No image available" className="max-w-full max-h-full" />
                </div>
            )}
        </div>
    );

    if(error){
      return <NotFound imagePath="../images/error404.gif" Title={error} ButtonText="Refresh" Route="/listBooks" Description={""}/>
    }

    const renderBookItem = (book: Book) => (
        <div
            key={book._id}
            className={`bg-white shadow-xl rounded-2xl overflow-hidden ${layout === "grid" ? "flex flex-col" : "flex flex-col md:flex-row"
                } transition-transform duration-300 hover:scale-105`}
        >
            {renderBookImage(book)}
            <div className="p-6 flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
                    {book.title}
                </h2>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-gray-700 line-clamp-3">{book.description}</p>
                {renderBookDetails(book)}
                <div className="flex gap-4">
                    <button
                        onClick={() => handleEdit(book)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => showDeleteWarning("Item", () => handleDelete(book._id))}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <ErrorBoundary FallbackComponent={({ error }) => (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error.message}
            </div>
        )}>
            <div className="container pt-24 mx-auto p-4 bg-gray-100 min-h-screen">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setLayout("grid")}
                        className={`p-2 ${layout === "grid" ? "bg-gray-600 text-white" : "bg-gray-300"
                            } rounded-l`}
                        aria-label="Switch to Grid Layout"
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setLayout("list")}
                        className={`p-2 ${layout === "list" ? "bg-gray-600 text-white" : "bg-gray-300"
                            } rounded-r`}
                        aria-label="Switch to List Layout"
                    >
                        <List size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array(6)
                            .fill(null)
                            .map((_, index) => (
                                <div key={index} className="bg-white shadow-xl rounded-2xl overflow-hidden">
                                    <Skeleton height={200} />
                                    <div className="p-6">
                                        <Skeleton count={3} />
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-screen text-red-500">
                        {error}
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-full text-center">
                        <NotFound
                            imagePath={notFoundImage}
                            Title="No books found"
                            ButtonText="Add Books"
                            Route="/addBooks"
                            Description="We could not find any books. You can add books by clicking on the add books button below."
                        />
                    </div>
                ) : (
                    <div
                        className={`${layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"
                            }`}
                    >
                        {books.map(renderBookItem)}
                    </div>
                )}

                {/* Edit Modal */}
                {editingBook && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
                        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const updatedBook = {
                                        _id: editingBook._id,
                                        title: formData.get("title") as string,
                                        author: formData.get("author") as string,
                                        description: formData.get("description") as string,
                                        qty: parseInt(formData.get("qty") as string),
                                        genre: formData.get("genre") as string,
                                        publisher: formData.get("publisher") as string,
                                        published_date: formData.get("published_date") as string,
                                        pages: parseInt(formData.get("pages") as string),
                                        price: parseFloat(formData.get("price") as string),
                                        images: editingBook.images,
                                    };
                                    handleSaveEdit(updatedBook);
                                }}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="edit-title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                        <input
                                            type="text"
                                            id="edit-title"
                                            name="title"
                                            defaultValue={editingBook.title}
                                            className="w-full p-2 border rounded"
                                            placeholder="Title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
                                        <input
                                            type="text"
                                            id="edit-author"
                                            name="author"
                                            defaultValue={editingBook.author}
                                            className="w-full p-2 border rounded"
                                            placeholder="Author"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                        <textarea
                                            id="edit-description"
                                            name="description"
                                            defaultValue={editingBook.description}
                                            className="w-full p-2 border rounded"
                                            placeholder="Description"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-qty" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
                                        <input
                                            type="number"
                                            id="edit-qty"
                                            name="qty"
                                            defaultValue={editingBook.qty}
                                            className="w-full p-2 border rounded"
                                            placeholder="Quantity"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-genre" className="block text-gray-700 text-sm font-bold mb-2">Genre:</label>
                                        <input
                                            type="text"
                                            id="edit-genre"
                                            name="genre"
                                            defaultValue={editingBook.genre}
                                            className="w-full p-2 border rounded"
                                            placeholder="Genre"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-publisher" className="block text-gray-700 text-sm font-bold mb-2">Publisher:</label>
                                        <input
                                            type="text"
                                            id="edit-publisher"
                                            name="publisher"
                                            defaultValue={editingBook.publisher}
                                            className="w-full p-2 border rounded"
                                            placeholder="Publisher"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-published_date" className="block text-gray-700 text-sm font-bold mb-2">Published Date:</label>
                                        <input
                                            type="date"
                                            id="edit-published_date"
                                            name="published_date"
                                            defaultValue={editingBook.published_date.split("T")[0]}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-pages" className="block text-gray-700 text-sm font-bold mb-2">Pages:</label>
                                        <input
                                            type="number"
                                            id="edit-pages"
                                            name="pages"
                                            defaultValue={editingBook.pages}
                                            className="w-full p-2 border rounded"
                                            placeholder="Pages"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="edit-price"
                                            name="price"
                                            defaultValue={editingBook.price}
                                            className="w-full p-2 border rounded"
                                            placeholder="Price"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBook(null)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        aria-label="Cancel editing"
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
        </ErrorBoundary>
    );
};

export default ListBooks;
