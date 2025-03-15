import React from "react";
import { useLocation, Link } from "react-router-dom";

interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return (
      <div className="pt-20 min-h-scree bg-white flex items-center justify-center py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops, No Order Found!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            It seems we couldn’t find your order details. Let’s get you back to exploring our collection!
          </p>
          <Link
            to="/home"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-700 transition duration-300 shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Image */}
        <div className="text-center mb-12 pt-20">
          <img
            src="../images/happy2.gif"
            alt="Order Confirmation Celebration"
            className="w-2/4 h-auto mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Hooray, Your Order is Confirmed!
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Thank you for shopping with us! Your books are on their way. We’ve sent a confirmation email with all the details below. Sit back, relax, and get ready to dive into your next great read!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Order Summary
          </h2>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Order Details
              </h3>
              <p className="text-gray-600">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="text-gray-600">
                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Shipping Address
              </h3>
              <p className="text-gray-600">
                {order.shippingAddress.address}, {order.shippingAddress.city},<br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Your Books
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.bookId}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                >
                  <div>
                    <p className="text-gray-800 font-medium">
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-10">
            <Link
              to="/home"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-700 transition duration-300 shadow-md"
            >
              Explore More Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;