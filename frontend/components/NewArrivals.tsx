import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import BookCard from "./BookCard"; // Import the reusable card
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

const NewArrivals: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const BACKEND_URL = "http://localhost:5000";
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get<Book[]>(
          `${BACKEND_URL}/api/books/newArrivals`
        );
        setBooks(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setError(`Failed to fetch new arrivals`);
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="flex flex-row w-full justify-center items-center bg-amber-50">
      <div className="w-full px-20 py-5 bg-gray-700">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl text-white ms-5 py-3 text-center">
            New Arrivals
          </h1>
        </div>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Slider {...settings}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <BookCard
                    key={index}
                    loading={true}
                    backendUrl={BACKEND_URL}
                    book={{} as Book}
                  />
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
  );
};

export default NewArrivals;
