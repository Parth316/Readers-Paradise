import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="bg-amber-50 min-h-screen py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3f3d3c] mb-4">
          No Order Found
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          It looks like there’s no order to display. Let’s get you back to shopping!
        </p>
        <Link
          to="/home"
          className="inline-block bg-slate-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#c1a36f] hover:text-black transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3f3d3c] text-center mb-8">
          Order Confirmation
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#3f3d3c] mb-4">
            Thank You for Your Order!
          </h2>
          <p className="text-gray-700 mb-4">
            Your order has been placed successfully. We’ll send you a confirmation
            email shortly with the details below.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
              Order Details
            </h3>
            <p className="text-gray-700">
              <strong>Order ID:</strong> {order._id}
            </p>
            <p className="text-gray-700">
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
            <h4 className="text-lg font-semibold text-[#3f3d3c] mt-4 mb-2">
              Shipping Address
            </h4>
            <p className="text-gray-700">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <h4 className="text-lg font-semibold text-[#3f3d3c] mt-4 mb-2">
              Items
            </h4>
            {order.items.map((item: any) => (
              <div
                key={item.bookId}
                className="flex justify-between border-b border-gray-200 py-2"
              >
                <span className="text-gray-700">
                  {item.title} (x{item.quantity})
                </span>
                <span className="text-gray-700">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/home"
              className="inline-block bg-slate-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#c1a36f] hover:text-black transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;