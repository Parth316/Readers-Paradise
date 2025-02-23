import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Book {
  title: string;
  author: string;
  isbn: string;
  description: string;
  image?: File;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pt-24 p-10">
        <button
          type="button"
          className=" h-72 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => navigate("/addBooks")}
        >
          Add Books
        </button>
        {/* <button
          type="button"
          className="h-72 text-white bg-gradient-to-br from-green-600 to-teal-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => navigate("/update-books")}
        >
          Update Books
        </button> */}
        <button
          type="button"
          className="h-72 text-white bg-gradient-to-br from-yellow-600 to-orange-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => navigate("/listBooks")}
        >
          List Books
        </button>
        <button
          type="button"
          className="h-72 text-white bg-gradient-to-br from-red-600 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => navigate("/listUsers")}
        >
          List Users
        </button>
      </div>
    </>
  );
};

export default AdminPanel;