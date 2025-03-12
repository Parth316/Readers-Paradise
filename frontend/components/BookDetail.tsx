import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  published_date: string;
  isbn?: string;
  description?: string;
  image: string;
  images: string[];
}

interface CartItem {
  _id: string;
  title: string;
  price: number; // Assuming price will be added to the Book model later; for now, set a default
  quantity: number;
  image: string;
}

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const BACKEND_URL = "http://localhost:5000";

// Define the type for arrow props
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Custom Arrows
function NextArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
}

function PrevArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
}

// Star Rating Component
const StarRating: React.FC<{ rating: number; onRatingChange: (rating: number) => void }> = ({
  rating,
  onRatingChange,
}) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          onClick={() => onRatingChange(index + 1)}
          className={`text-2xl ${index < rating ? "text-amber-500" : "text-gray-300"} focus:outline-none`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<Book>(`${BACKEND_URL}/api/books/${id}`);
        setBook(response.data);
        console.log("Fetched book data:", response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>(`${BACKEND_URL}/api/books/${id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [id]);

  // Add book to cart with toast notification
  const addToCart = () => {
    if (!book) return;
    const cartItem: CartItem = {
      _id: book._id,
      title: book.title,
      price: 10.99, // Replace with actual price
      quantity: quantity,
      image: book.images[0] || "", // Use the first image from book.images
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

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/books/${id}/reviews`, newReview);
      console.log(response.data);
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: "" });
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
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
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Slider Section */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] p-6 border border-gray-300">
              {book.images && book.images.length > 0 ? (
                <Slider {...sliderSettings} className="h-full">
                  {book.images.map((img, index) => {
                    const imageUrl = img.startsWith("http") ? img : `${BACKEND_URL}/${img}`;
                    return (
                      <div key={index} className="h-full flex items-center justify-center p-4">
                        <img
                          src={imageUrl}
                          alt={`${book.title} ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150"; // Fallback image
                          }}
                        />
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <p className="text-center text-gray-500">No images available</p>
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
                  <div className="text-center bg-amber-50 p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Genre</p>
                    <p className="text-gray-700">{book.genre}</p>
                  </div>
                  <div className="text-center bg-amber-50 p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Published</p>
                    <p className="text-gray-700">{new Date(book.published_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center bg-amber-50 p-3 rounded-lg shadow-sm">
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
                <div className="bg-amber-50 p-6 rounded-xl mb-8">
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

        {/* Ratings and Reviews Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reviews List */}
            <div>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-lg shadow-md mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-amber-600 font-bold">{review.user}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.rating ? "text-amber-500" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Review Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-gray-700 mb-2">Rating</label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-gray-700 mb-2">Comment</label>
                  <textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
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