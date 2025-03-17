import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useIsbnValidation = () => {
  const [isbnInput, setIsbnInput] = useState<string>("");
  const [isbnMatch, setIsbnMatch] = useState<string | null>(null);
  const [isbnError, setIsbnError] = useState<string | null>(null);

  const fetchBookByIsbn = async (isbn: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/isbn/${isbn}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setIsbnMatch(response.data); // Assuming response.data is the title or similar
      setIsbnError(null);
    } catch (err: any) {
      setIsbnMatch(null);
      setIsbnError(err.response?.data?.message || "No book found with this ISBN.");
    }
  };

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isbn = e.target.value;
    setIsbnInput(isbn);
    if (isbn.length >= 10) {
      fetchBookByIsbn(isbn);
    } else {
      setIsbnMatch(null);
      setIsbnError(null);
    }
  };

  return { isbnInput, isbnMatch, isbnError, handleIsbnChange };
};