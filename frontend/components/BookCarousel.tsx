import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import BookCard from "./BookCard"; 
import { Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  published_date: string;
  isbn?: string;
  image: string;
  images: string[];
}

interface BookCarouselProps {
  category: string; // Example: "newArrivals", "bestSellers", etc.
  bgColor?: string; // Allow background color customization
}

const BookCarousel: React.FC<BookCarouselProps> = ({ category, bgColor = "bg-gray-700" }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<Book[]>(`${BACKEND_URL}/api/books/${category}`);
        setBooks(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setError(`Failed to fetch books`);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  
  return (
    <div className=" bg-gray-800">
    <div className={`flex justify-center items-center ${bgColor}`}>
      <div className="w-full px-20 py-5">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl text-black font-semibold py-3 text-center capitalize">{category.replace(/([A-Z])/g, ' $1')}</h1>
        </div>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Slider {...settings}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <BookCard key={index} loading={true} backendUrl={BACKEND_URL} book={{} as Book} />
                ))
              : books.map((book) => (
                  <Link key={book._id} to={`/books/${book._id}`}>
                    <BookCard book={book} backendUrl={BACKEND_URL} />
                  </Link>
                ))}
          </Slider>
        )}
      </div>
    </div>
                </div>
  );
};

export default BookCarousel;