import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // For notifications (optional)

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch cart items from localStorage
  useEffect(() => {
    const fetchCartData = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    };
    fetchCartData();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Please log in to place an order.");
      return;
    }

    // Validate shipping address
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      toast.error("Please fill in all shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          bookId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress,
        totalAmount: totalPrice,
      };

      const response = await axios.post("http://localhost:5000/api/orders/create", orderData);

      if (response.status === 201) {
        // Clear cart after successful order
        localStorage.removeItem("cart");
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", { state: { order: response.data.order } });
      } else {
        toast.error("Failed to place order.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while placing the order.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="bg-gray-100 min-h-screen py-16 w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3f3d3c] my-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                  Order Summary
                </h2>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-[#3f3d3c]">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <h3 className="text-lg font-semibold text-[#3f3d3c]">Total:</h3>
                  <p className="text-lg font-semibold text-[#3f3d3c]">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md ">
                <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
                  Shipping & Payment Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Shipping Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Address
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
                      City
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
                      Postal Code
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
                      Country
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

                  {/* Payment Method */}
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

                  {/* Place Order Button */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;