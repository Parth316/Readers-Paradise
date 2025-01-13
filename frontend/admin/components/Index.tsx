import React, { useState } from "react";

interface Book {
  title: string;
  author: string;
  isbn: string;
  description: string;
  image?: File;
}

const AdminPanel: React.FC = () => {
  const [show, setshow] = useState(false);
  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    isbn: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBook({
        ...book,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to handle book submission, e.g., send the book data to your backend
    console.log("Book added:", book);
    // Reset the form
    setBook({
      title: "",
      author: "",
      isbn: "",
      description: "",
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-4 bg-slate-400 m-3 space-x-2 w-2/4 pt-20">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 p-4"
        >
          Add Books
        </button>
        <button className="mt-6 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300">
          Explore
        </button>
        <button className="mt-6 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300">
          Explore
        </button>
        <button className="mt-6 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300">
          Explore
        </button>
      </div>
      {show && (
        <div className="pt-20 max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            Add a New Book
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author:
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={book.author}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700"
              >
                ISBN:
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={book.isbn}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={book.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Book
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
