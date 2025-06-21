import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDashboardData } from "../../hooks/useDashboardData"; // Adjust path
import { RefreshCw } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types
interface OverviewMetric {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
}

interface DashboardAction {
  title: string;
  icon: string;
  description: string;
  action: () => void;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, loading, refetch } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger animation and refetch
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500); // Match animation duration
  };

  // Dashboard actions
  const dashboardActions: DashboardAction[] = [
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
      icon: "📊",
      description: "Update book quantities",
      action: () => navigate("/updateBookQty"),
    },
  ];

  // Overview metrics
  const overviewData: OverviewMetric[] = [
    { title: "Total Books", value: dashboardData.totalBooks, change: "+5%", icon: "📚" },
    { title: "Pending Orders", value: dashboardData.pendingOrders, change: "-2%", icon: "📦" },
    { title: "Total Users", value: dashboardData.totalUsers, change: "+3%", icon: "👥" },
    { title: "Recent Activity", value: dashboardData.recentActivity, icon: "📊" },
  ];

  // Line chart for orders over time
  const ordersChartData = {
    labels: dashboardData.ordersOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Orders",
        data: dashboardData.ordersOverTime.map((item) => item.count),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  // Bar chart for low stock books
  const lowStockChartData = {
    labels: dashboardData.lowStockBooks.map((book) => book.title),
    datasets: [
      {
        label: "Stock Level",
        data: dashboardData.lowStockBooks.map((book) => book.stock),
        backgroundColor: dashboardData.lowStockBooks.map((book) =>
          book.stock <= 3 ? "#EF4444" : "#10B981"
        ),
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6 pt-24 text-center text-gray-800">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24" style={{ backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-200 transition duration-300"
          aria-label="Refresh Data"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? "animate-spin-once" : ""}`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {overviewData.map((item, index) => (
            <div key={index} className="p-5 rounded-lg shadow-md bg-white border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-2xl">{item.icon}</span>
                {item.change && <span className="text-xs text-gray-500">vs Last Week</span>}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">{item.title}</h3>
              <p className="text-xl font-bold text-gray-700">{item.value}</p>
              {item.change && (
                <p className={`text-sm ${item.change.startsWith("+") ? "text-blue-500" : "text-red-500"}`}>
                  {item.change}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders Over Time</h2>
            <Line
              data={ordersChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { ...chartOptions.plugins.title, text: "Orders Over Time" },
                },
              }}
            />
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Books</h2>
            <Bar
              data={lowStockChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { ...chartOptions.plugins.title, text: "Low Stock Books" },
                },
              }}
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {dashboardActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-5 rounded-lg shadow-md bg-white text-gray-800 hover:bg-gray-50 transition duration-300 flex flex-col items-center justify-center h-48 border border-gray-200 hover:border-blue-500"
              >
                <span className="text-4xl mb-2 text-gray-600">{action.icon}</span>
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="text-sm mt-1 text-center text-gray-500">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-medium text-gray-600">Order ID</th>
                <th className="p-3 font-medium text-gray-600">Customer</th>
                <th className="p-3 font-medium text-gray-600">Total</th>
                <th className="p-3 font-medium text-gray-600">Status</th>
                <th className="p-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{order._id || order._id}</td>
                  <td className="p-3">{order.shippingAddress?.recipientName || order.shippingAddress.recipientName || "N/A"}</td>
                  <td className="p-3">{order.totalAmount ? `$${order.totalAmount}` : order.totalAmount || "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/orderProcess/${(order.orderId || order._id).replace("#", "")}`)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
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
        <div className="bg-white p-5 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-medium text-gray-600">Book Title</th>
                <th className="p-3 font-medium text-gray-600">ISBN</th>
                <th className="p-3 font-medium text-gray-600">Current Stock</th>
                <th className="p-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.lowStockBooks.map((book, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.isbn}</td>
                  <td className="p-3 text-red-500">{book.stock}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate("/updateBookQty")}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Restock
                    </button>
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