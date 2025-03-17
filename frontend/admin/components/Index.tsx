import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  
  // Dashboard actions (existing)
  const dashboardActions = [
    {
      title: "Add Books",
      icon: "📚",
      description: "Add new books to the store",
      action: () => navigate("/addBooks"),
    },
    {
      title: "List Orders",
      icon: "📦",
      description: "View and manage customer orders",
      action: () => navigate("/listOrders"),
    },
    {
      title: "List Books",
      icon: "📖",
      description: "View and edit book inventory",
      action: () => navigate("/listBooks"),
    },
    {
      title: "List Users",
      icon: "👥",
      description: "Manage user accounts",
      action: () => navigate("/listUsers"),
    },
    {
      title: "Manage Inventory",
      icon: "👥",
      description: "Manage user accounts",
      action: () => navigate("/updateBookQty"),
    },
  ];

  // Mock overview metrics
  const overviewData = [
    { title: "Total Books", value: "1,234", change: "+5%", icon: "📚" },
    { title: "Pending Orders", value: "56", change: "-2%", icon: "📦" },
    { title: "Total Users", value: "789", change: "+3%", icon: "👥" },
    { title: "Recent Activity", value: "5 orders packed today", icon: "📊" },
  ];

  // Mock recent orders
  const recentOrders = [
    { orderId: "#12345", customer: "John Doe", total: "$45.00", status: "Pending" },
    { orderId: "#12346", customer: "Jane Smith", total: "$30.00", status: "Packed" },
  ];

  // Mock low stock books
  const lowStockBooks = [
    { title: "Book A", isbn: "1234567890", stock: 3 },
    { title: "Book B", isbn: "0987654321", stock: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Overview Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {overviewData.map((item, index) => (
            <div key={index} className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-gray-500">vs Last Week</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">{item.title}</h3>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
              <p className={`text-sm }`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-6 rounded-lg shadow-md bg-white text-gray-800 hover:bg-gray-50 transition duration-300 flex flex-col items-center justify-center h-48 border border-gray-200 hover:border-blue-500"
              >
                <span className="text-4xl mb-2 text-gray-600">{action.icon}</span>
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="text-sm mt-1 text-center text-gray-500">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-gray-600">Order ID</th>
                <th className="p-3 text-gray-600">Customer</th>
                <th className="p-3 text-gray-600">Total</th>
                <th className="p-3 text-gray-600">Status</th>
                <th className="p-3 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{order.orderId}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/orderProcess/${order.orderId.replace("#", "")}`)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-gray-600">Book Title</th>
                <th className="p-3 text-gray-600">ISBN</th>
                <th className="p-3 text-gray-600">Current Stock</th>
                <th className="p-3 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockBooks.map((book, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.isbn}</td>
                  <td className="p-3 text-red-500">{book.stock}</td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:underline">Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;