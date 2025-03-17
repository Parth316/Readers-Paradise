// BookDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import Reviews from "./Reviews";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  published_date: string;
  isbn?: string;
  description?: string;
  image: string;
  price: number;
  images: string[];
}

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Review {
  _id: string;
  book: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const BACKEND_URL = "http://localhost:5000";
function NextArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div
      className={`${className} flex items-center justify-center w-10 h-10 right-[-20px] z-10`}
      style={style}
      onClick={onClick}
      aria-label="Next"
    >
      <div className="arrow-container bg-black/70 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-md hover:bg-black/90 hover:scale-105 active:scale-95">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function PrevArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div
      className={`${className} flex items-center justify-center w-10 h-10 left-[-20px] z-10`}
      style={style}
      onClick={onClick}
      aria-label="Previous"
    >
      <div className="arrow-container bg-black/70 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 shadow-md hover:bg-black/90 hover:scale-105 active:scale-95">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<Book>(`${BACKEND_URL}/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const addToCart = () => {
    if (!book) return;
    const cartItem: CartItem = {
      _id: book._id,
      title: book.title,
      price: book.price,
      quantity: quantity,
      image: book.images[0] || "",
    };
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item: CartItem) => item._id === book._id);
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${quantity} x ${book.title} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (loading) return <div className="text-center py-8 animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!book) return <div className="text-center py-8">Book not found</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: book.images.length > 1,
    autoplay: book.images.length > 1,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Slider Section */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-cover ps-10 bg-center">
              {book.images && book.images.length > 0 ? (
                <Slider {...sliderSettings} className="h-full w-full">
                  {book.images.map((img, index) => {
                    const imageUrl = img.startsWith("http") ? img : `${BACKEND_URL}/${img}`;
                    return (
                      <div key={index} className="h-full flex items-center justify-center mt-12 ">
                        <div className="flex w-full h-full max-h-fit align-center justify-center ">
                          <img
                            src={imageUrl}
                            alt={`${book.title} ${index + 1}`}
                            className="w-2/3 h-auto object-contain max-w-full max-h-full shadow-xl mb-10 rounded-md hover:scale-105 duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <img
                  src="../images/notfound.png"
                  alt="Book Cover"
                  className="w-full h-auto object-contain rounded-xl shadow-lg"
                />
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                    {book.title}
                  </h1>
                  <p className="text-xl text-amber-700 font-medium tracking-wide">
                    {book.author.toUpperCase()}
                  </p>
                  <p className="mt-3 text-2xl text-gray-700 font-bold p-2 bg-slate-200 w-fit rounded-md tracking-wide">
                    {book.price}$
                  </p>
                </div>

                <div className="mb-8">
                  <div className="border-l-4 border-amber-600 pl-4">
                    <p className="text-gray-700 italic text-lg font-light">
                      "The story of mankind is in you, the vast experience, the deep-rooted fears,
                      anxieties, sorrow, pleasure and all the beliefs that man has accommodated
                      throughout the millennia. You are that book."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Genre</p>
                    <p className="text-gray-700">{book.genre}</p>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Published</p>
                    <p className="text-gray-700">{new Date(book.published_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center bg-white p-3 rounded-lg shadow-sm overflow-hidden">
                    <p className="text-sm font-semibold text-amber-700 mb-1">ISBN</p>
                    <p className="text-gray-700">{book.isbn || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    About the Book
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description || "No description available."}
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-white p-6 rounded-xl mb-8">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                      365 Daily Meditations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                      Thematic Weekly Structure
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <label htmlFor="quantity" className="mr-2 text-gray-700">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 p-1 border border-gray-300 rounded"
                  />
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-600 hover:bg-amber-700"
                >
                  Back to Collection
                </Link>
                <button
                  onClick={addToCart}
                  className="ms-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-amber-600 hover:bg-amber-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Component */}
        <Reviews
          id={id!}
          reviews={reviews}
          setReviews={setReviews}
          isAuthenticated={isAuthenticated}
          user={user}
          token={localStorage.getItem("token")}
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BookDetail;