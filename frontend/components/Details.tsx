import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { RootState, AppDispatch } from "../redux/store";
import { setSelectedBook } from "../redux/bookSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const bookFromStore = useSelector((state: RootState) => state.book.selectedBook);
  const [book, setBook] = useState(bookFromStore);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (id) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/books/${id}`);
          setBook(response.data);
          dispatch(setSelectedBook(response.data));
        } catch (error) {
          console.error("Failed to fetch book", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!bookFromStore || bookFromStore.id !== id) {
      fetchBookDetails();
    } else {
      setLoading(false);
    }
  }, [id, dispatch, bookFromStore]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">No book selected. Please go back and select a book.</p>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {book.images && book.images.length > 0 ? (
              <Slider {...sliderSettings}>
                {book.images.map((img, index) => (
                  <div key={index}>
                    <img
                      src={`${BACKEND_URL}/${img}`}
                      alt={book.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src="/images/nobookfound.png"
                alt={book.title}
                className="w-full h-96 object-cover"
              />
            )}
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h2>
              <p className="text-lg text-gray-600 mb-2">by {book.author}</p>
              <p className="text-md text-gray-500 mb-2"><strong>ISBN:</strong> {book.isbn}</p>
              <p className="text-md text-gray-500 mb-2"><strong>Quantity:</strong> {book.qty}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{book.description}</p>
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-500 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;