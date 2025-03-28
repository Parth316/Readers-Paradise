// Checkout.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  isbn: string;
}

interface ShippingAddress {
  recipientName: string; // New: Name of the recipient
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string; // New: Contact number
  email: string; // New: Contact email
  deliveryInstructions?: string; // New: Optional instructions (e.g., "Leave at door")
}
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    email: "",
    deliveryInstructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false); // New state for GIF

  useEffect(() => {
    const fetchCartData = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    };
    fetchCartData();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (
      !shippingAddress.recipientName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phoneNumber ||
      !shippingAddress.email
    ) {
      toast.error("Please fill in all shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    setShowLoading(true); // Show the loading GIF

    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          bookId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          isbn: item.isbn,
        })),
        shippingAddress,
        totalAmount: totalPrice,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        localStorage.removeItem("cart");
        toast.success("Order placed successfully!");

        // Simulate a 2-3 second delay before navigating
        setTimeout(() => {
          setShowLoading(false); // Hide the GIF
          navigate("/orderConfirmation", {
            state: {
              order: response.data.order,
              lowStockBooks: response.data.lowStockBooks, // Include if using previous low stock feature
            },
          });
        }, 2500); // 2.5 seconds delay
      }
    } catch (error) {
      setShowLoading(false); // Hide GIF on error
      const errorMessage =
        error.response?.data?.message || "An error occurred while placing the order.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="bg-gray-100 min-h-screen py-16 w-full relative">
      {/* Loading GIF Overlay */}
      {showLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <img
            src="../images/book.gif"
            alt="Loading..."
            className="w-48 h-48 md:w-48 md:h-48"
          />
        </div>
      )}
  
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3f3d3c] my-8 text-center">
          Checkout
        </h1>
  
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 text-lg mb-4">Your cart is empty.</p>
            <Link
              to="/home"
              className="inline-block bg-slate-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#c1a36f] hover:text-black transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Order Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                Order Summary
              </h2>
              <hr />
              {cartItems.map((item) => {
                const backendUrl =
                  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
                const imageUrl =
                  item.image && item.image.startsWith("http")
                    ? item.image
                    : `${backendUrl}/${item.image}`;
  
                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start w-full sm:w-auto">
                      {item.image && (
                        <img
                          src={imageUrl || "../images/notfound.png"}
                          alt={item.title}
                          className="w-32 h-48 object-contain rounded-md mb-4 sm:mb-0 sm:mr-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      )}
                      <div className="flex flex-col text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#3f3d3c]">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-lg sm:text-xl">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-gray-700 font-semibold text-lg sm:text-xl">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between mt-4">
                <h3 className="text-lg font-semibold text-[#3f3d3c]">Total:</h3>
                <p className="text-lg font-semibold text-[#3f3d3c]">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
  
            {/* Shipping & Payment Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                Shipping & Payment Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="recipientName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={shippingAddress.recipientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="123 Book Street"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="Literature City"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="90210"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="United States"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={shippingAddress.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="+1 123-456-7890"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="container border border-x-2 p-5 rounded ">

                  <h2 className="text-xl font-semibold pb-1">Gift Options</h2><hr />
                  <div>
                    <label
                      htmlFor="deliveryInstructions"
                      className="mt-2 block text-gray-700 font-medium mb-1"
                    >
                      Add a notecard for your loved ones for gifts(Optional)
                    </label>
                    <input
                      type="text"
                      id="deliveryInstructions"
                      name="deliveryInstructions"
                      value={shippingAddress.deliveryInstructions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border mb-2 border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                      placeholder="e.g. Place Happy Birthday notecard inside the package"
                    />
                  </div>
                 
                      </div>
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f]"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                  </div>
                </div>
  
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-lg bg-slate-600 text-white py-3 rounded-full border-2 border-gray-600 transition duration-300 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#c1a36f] hover:text-black"
                  }`}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;