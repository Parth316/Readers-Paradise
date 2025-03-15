// Reviews.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Review {
  _id: string;
  book: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

interface ReviewsProps {
  id: string;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  isAuthenticated: boolean;
  user: any;
  token: string | null;
}

const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}> = ({ rating, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          onClick={() => !readOnly && onRatingChange && onRatingChange(index + 1)}
          className={`text-2xl ${
            index < rating ? "text-amber-500" : "text-gray-300"
          } ${readOnly ? "" : "focus:outline-none"}`}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Reviews: React.FC<ReviewsProps> = ({
  id,
  reviews,
  setReviews,
  isAuthenticated,
  user,
  token,
}) => {
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>(`${BACKEND_URL}/api/books/${id}/fetchReviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [id, setReviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please log in to submit a review.");
      navigate("/login");
      return;
    }

    const reviewData = {
      user: user.id,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/books/${id}/addReview`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setNewReview({ rating: 5, comment: "" });
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit review.";
      toast.error(errorMessage);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewReview({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user || !editingReview) {
      toast.error("Please log in to edit a review.");
      navigate("/login");
      return;
    }

    const reviewData = {
      user: user.id,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/books/reviews/${editingReview._id}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prevReviews) =>
        prevReviews.map((rev) =>
          rev._id === editingReview._id ? response.data : rev
        )
      );
      setEditingReview(null);
      setNewReview({ rating: 5, comment: "" });
      toast.success("Review updated successfully!");
    } catch (error: any) {
      console.error("Error updating review:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update review.";
      toast.error(errorMessage);
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Ratings & Reviews
      </h2>

      {/* Reviews List */}
      <div className="mb-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 py-4 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-600 font-semibold">
                  {review.user}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                    {review.updatedAt && " (Edited)"}
                  </span>
                  {isAuthenticated && user && review.user === user.id && (
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <StarRating rating={review.rating} readOnly />
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* Review Form */}
      <div>
        <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">
          {editingReview ? "Edit Your Review" : "Write a Review"}
        </h3>
        <form onSubmit={editingReview ? handleUpdateReview : handleReviewSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="rating"
              className="block text-gray-700 font-medium mb-2"
            >
              Your Rating
            </label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) =>
                setNewReview({ ...newReview, rating })
              }
            />
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-gray-700 font-medium mb-2"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={4}
              required
              placeholder="Share your thoughts about this book..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors duration-200"
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </button>
            {editingReview && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reviews;