import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, SortAsc, ArrowUp, List, Grid } from "lucide-react";

interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  isbn?: string;
}

interface ShippingAddress {
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
  deliveryInstructions?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

const ListOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [isListView, setIsListView] = useState<boolean>(() => {
    return localStorage.getItem("orderView") === "list"; // Load from localStorage
  });

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const allOrders = response.data as Order[];
        const nonPackedOrders = allOrders.filter((order) => order.status !== "packed");
        setOrders(nonPackedOrders);
        setFilteredOrders(nonPackedOrders);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
        toast.error("Could not load your orders. Please try again.");
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem("orderView", isListView ? "list" : "grid");
  }, [isListView]);

  // Filter and Sort Logic
  useEffect(() => {
    const filterOrders = () => {
      let result = [...orders];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (order) =>
            order._id.toLowerCase().includes(query) ||
            order.shippingAddress.recipientName.toLowerCase().includes(query) ||
            order.items.some(
              (item) =>
                item.title.toLowerCase().includes(query) ||
                (item.isbn && item.isbn.toLowerCase().includes(query))
            )
        );
      }
      if (sortOption) {
        result = sortOrders(result, sortOption);
      }
      setFilteredOrders(result);
    };

    filterOrders();
  }, [searchQuery, sortOption, orders]);

  const sortOrders = (ordersToSort: Order[], option: string): Order[] => {
    switch (option) {
      case "bookTitle":x
        return ordersToSort.sort((a, b) => {
          const aTitle = a.items[0]?.title || "";
          const bTitle = b.items[0]?.title || "";
          return aTitle.localeCompare(bTitle);
        });
      case "country":
        return ordersToSort.sort((a, b) =>
          a.shippingAddress.country.localeCompare(b.shippingAddress.country)
        );
      case "status":
        return ordersToSort.sort((a, b) => a.status.localeCompare(b.status));
      case "quantity":
        return ordersToSort.sort((a, b) => {
          const aQty = a.items.reduce((sum, item) => sum + item.quantity, 0);
          const bQty = b.items.reduce((sum, item) => sum + item.quantity, 0);
          return bQty - aQty;
        });
      default:
        return ordersToSort;
    }
  };

  const handleProcessOrder = (orderId: string) => {
    navigate(`/orderProcess/${orderId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Orders</h1>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search by recipient, order #, ISBN, or book"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 appearance-none"
              >
                <option value="">Sort By</option>
                <option value="bookTitle">Book Title</option>
                <option value="country">Country</option>
                <option value="status">Order Status</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>
            <button
              onClick={() => setIsListView(!isListView)}
              className="w-full sm:w-auto bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition duration-300 flex items-center justify-center"
            >
              {isListView ? <Grid size={20} className="mr-2" /> : <List size={20} className="mr-2" />}
              {isListView ? "Grid View" : "List View"}
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-700 text-lg mb-4">
              {searchQuery ? "No orders match your search." : "You haven’t placed any orders yet."}
            </p>
            <a
              href="/home"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-amber-700 transition duration-300"
            >
              Start Shopping
            </a>
          </div>
        ) : isListView ? (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-gray-700 font-semibold">Order #</th>
                  <th className="p-4 text-gray-700 font-semibold">Date</th>
                  <th className="p-4 text-gray-700 font-semibold">Recipient</th>
                  <th className="p-4 text-gray-700 font-semibold">Items</th>
                  <th className="p-4 text-gray-700 font-semibold">Total</th>
                  <th className="p-4 text-gray-700 font-semibold">Status</th>
                  <th className="p-4 text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t bg-white">
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{order.shippingAddress.recipientName}</td>
                    <td className="p-4">
                      {order.items.map((item) => (
                        <div key={item.bookId}>
                          {item.quantity}x {item.title}
                        </div>
                      ))}
                    </td>
                    <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">{order.status.toUpperCase()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleProcessOrder(order._id)}
                        className="bg-gray-600 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition duration-300"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg shadow-md p-6 border border-gray-200 bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order #{order._id}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-800 font-semibold text-lg mt-2 md:mt-0">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.bookId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.image && (
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `${BACKEND_URL}/${item.image}`
                              }
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded mr-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/150";
                              }}
                            />
                          )}
                          <div>
                            <p className="text-gray-800 font-medium">{item.title}</p>
                            <p className="text-gray-600 text-sm">
                              <strong>Qty:</strong> {item.quantity} - ${item.price.toFixed(2)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <strong>ISBN:</strong>{item.isbn}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-1">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-gray-600 pb-2">
                    {order.shippingAddress.recipientName}, {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>

                
                <div className="border-t border-gray-200 pt-1">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    NoteCard
                  </h3>
                  <p className="text-gray-600 pb-2">
                    {order.shippingAddress.deliveryInstructions}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Status</h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-black p-3 bg-gray-50 font-semibold">
                      {order.status.toUpperCase()}
                    </p>
                    <button
                      className="mt-2 sm:mt-0 w-full sm:w-fit bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 rounded-full shadow-md transition duration-300"
                      onClick={() => handleProcessOrder(order._id)}
                    >
                      Process Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition duration-300"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default ListOrders;