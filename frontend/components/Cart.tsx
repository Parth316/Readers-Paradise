import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "../admin/components/NotFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TrashIcon } from "lucide-react";
interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch cart data from local storage
  const fetchCartData = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    setLoading(false);
  };

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Quantity updated successfully!");
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.error("Item removed from cart!");
  };

  // Fetch cart data on component mount and listen for storage changes
  useEffect(() => {
    fetchCartData();
    window.addEventListener("storage", fetchCartData);
    return () => {
      window.removeEventListener("storage", fetchCartData);
    };
  }, []);

  // Update local storage when cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total price
  const getTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row items-stretch">
      <div className="w-full sm:w-1/3 p-4 flex items-center justify-center bg-gray-50">
        <Skeleton height={150} width={150} />
      </div>
      <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
        <Skeleton count={3} />
        <Skeleton height={40} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-600 mb-8 mt-8">
          Cart
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {[1, 2, 3].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <NotFound
            imagePath="../images/cart.png"
            Title="The cart is empty."
            ButtonText="Explore"
            Route="/home"
            Description="Looks like you haven't added any items to your cart yet. Start exploring our collection of books and resources to find something great!"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {cartItems.map((item) => {
                const backendUrl =
                  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
                const imageUrl = item.image.startsWith("http")
                  ? item.image
                  : `${backendUrl}/${item.image}`;
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row items-stretch transition-shadow duration-300 hover:shadow-xl"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-1/3 p-4 flex items-center justify-center bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="m
                        ax-w-full max-h-48 object-contain rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/150"; // Fallback image
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Price: ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mb-2">
                          <label className="mr-2 text-gray-700">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, parseInt(e.target.value))
                            }
                            className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 sm:w-24"
                          />
                        </div>
                        <p className="text-gray-800 font-medium">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="w-fit flex space-x-2 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg md:py-3 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300"
                        >
                        <TrashIcon className="text-lg" /> {/* Trash Icon */}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <p className="text-xl font-bold text-gray-900 mb-4">
                Total Amount: ${getTotal()}
              </p>
              <Link
                to="/checkout"
                className="w-fit flex space-x-2 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg md:py-3 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300"
                >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
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

export default Cart;