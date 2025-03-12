// src/components/BookCard.tsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedBook } from "../redux/bookSlice";
import { Book } from "../redux/bookSlice";

interface BookCardProps {
  book: Book;
  loading?: boolean;
  fallbackImage?: string;
  backendUrl: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  loading = false,
  fallbackImage = "/images/nobookfound.png",
  backendUrl,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-gray-50 rounded-3xl shadow-lg overflow-hidden flex flex-col">
          <Skeleton height={300} />
          <div className="p-2 flex flex-col gap-2">
            <Skeleton width="80%" height={20} />
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={16} />
            <Skeleton width="50%" height={16} />
            <Skeleton width="100%" height={30} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() => {
        dispatch(setSelectedBook(book));
      }}
    >
      <div className="bg-gray-50 rounded-3xl shadow-lg overflow-hidden flex flex-col hover:bg-slate-200">
        <img
          src={
            book.images && book.images.length > 0
              ? `${backendUrl}/${book.images[0]}`
              : fallbackImage
          }
          alt={book.title}
          className="object-contain w-full h-[250px]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            target.onerror = null;
          }}
        />
        <div className="p-2 flex flex-col justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              {book.title}
            </p>
            <p className="text-xs text-gray-600">{book.author}</p>
            <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
            <p className="text-xs text-gray-500">Qty: {book.qty}</p>
          </div>
          <div className="p-1 flex justify-center items-center">
            <button className="w-full text-xs md:text-xl bg-slate-600 text-white md:py-4 rounded-2xl border-2 border-gray-600 hover:bg-[#c1a36f] hover:text-black transition duration-300">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
