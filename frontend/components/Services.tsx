import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  UserCheck,
  Users,
  BookOpen,
  Package,
  Headphones,
  ShoppingCart,
  Edit,
  CheckCircle,
  Eye,
  Search,
  Filter,
  Layout,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Services: React.FC = () => {
  const [isProjectDetailsVisible, setIsProjectDetailsVisible] = useState(false);

  const toggleProjectDetails = () => {
    setIsProjectDetailsVisible(!isProjectDetailsVisible);
  };

  return (
    <div className="bg-amber-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#3f3d3c] mb-4">
            Our Services
          </h1>
          <p className="text-lg text-[#3f3d3c] max-w-2xl mx-auto">
            At Reader’s Paradise, we offer services to enhance your reading
            experience, from discovering books to connecting with others.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#3f3d3c] text-center mb-6">
            Key Features of Reader’s Paradise
          </h2>

          {/* Users Features */}
          <h3 className="text-xl font-semibold text-[#3f3d3c] mb-4 text-center">
            For Users
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Login</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Sign up</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                Forgot Password
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Add to Cart</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Edit className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Add Review</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Edit className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Edit Review</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Checkout</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                Custom Message Gift Card Option
              </p>
            </div>
          </div>

          {/* Admin Features */}
          <h3 className="text-xl font-semibold text-[#3f3d3c] mb-4 text-center">
            For Admin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Eye className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Dashboard</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Book className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Add Book</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Book className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">List Book</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Edit className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Edit Book</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Book className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Delete Book</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Users className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">See User List</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Eye className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">See Orders</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Search className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Search Orders</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Filter className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Sort Orders</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Layout className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                List View/Grid View Saving
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                Process Orders
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Package className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">Pack Orders</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Package className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                Generate Shipping Label
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                Generate Gift Notecard
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:bg-[#FFD58D] hover:scale-105 transition-all duration-200">
              <div className="flex justify-center mb-2">
                <Search className="w-5 h-5 text-[#D89B30]" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                ISBN Matching to Reduce Errors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleProjectDetails}
              className="flex items-center bg-[#D89B30] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c1a36f] transition-colors duration-200"
            >
              {isProjectDetailsVisible
                ? "Hide Project Details"
                : "Show Project Details"}
              {isProjectDetailsVisible ? (
                <ChevronUp className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDown className="w-5 h-5 ml-2" />
              )}
            </button>
          </div>

          {isProjectDetailsVisible && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#3f3d3c] mb-4">
                Project Details
              </h2>

              {/* Why MongoDB */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Why MongoDB?
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    Flexible, schema-less database for storing diverse order
                    data
                  </li>
                  <li>
                    Scalable and handles large volumes of data efficiently
                  </li>
                  <li>Integrates well with Node.js backend</li>
                </ul>
              </div>
              {/* Security */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Security
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Password encryption using bcrypt</li>
                  <li>JWT token for security (1-hour expiry)</li>
                  <li>Admin protected routes</li>
                  <li>Role-based authentication</li>
                </ul>
              </div>

              {/* Why Redux State Management */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Why Redux State Management?
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    Central state management library for accessing states
                    between multiple components
                  </li>
                  <li>Easily scalable for large apps</li>
                </ul>
              </div>
              {/* Future Enhancements */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Future Enhancements
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Add real-time tracking integration with carriers</li>
                  <li>
                    Introduce automated email notifications for order updates
                  </li>
                  <li>JWT token store in the database</li>
                  <li>Input sanitization</li>
                  <li>More control over User management</li>
                  <li>Automatic Invoice generation</li>
                </ul>
              </div>

              {/* Current Problems */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Current Problems with the Project
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>No real-time tracking</li>
                  <li>
                    Responsive to some extent but not fully responsive due to
                    complexity of components
                  </li>
                </ul>
              </div>

              {/* Why Future Ready */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Why Future Ready?
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Redux state management</li>
                  <li>More organized structure with RESTful APIs</li>
                  <li>
                    createAsyncThunk for handling asynchronous logic,
                    particularly for actions that involve side effects like data
                    fetching, file uploads, or other asynchronous tasks
                  </li>
                  <li>
                    Already implemented Open Library API to fetch data directly
                    from the archive
                  </li>
                </ul>
              </div>

              {/* Why It's Different */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#3f3d3c] mb-2">
                  Why It’s Different?
                </h3>
                <h4 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                  User
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-2">
                  <li>Notecard feature for presents</li>
                </ul>
                <h4 className="text-lg font-semibold text-[#3f3d3c] mb-1">
                  Admin
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Matching ISBN feature to reduce errors to 99%</li>
                  <li>
                    Very common features that sometimes help a lot (Search,
                    Sort, Back to top)
                  </li>
                  <li>Enhanced User Experience compared to other sites</li>
                  <li>Automatic package slip generation for custom carriers</li>
                  <li>Automatic Notecard generation</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#3f3d3c] mb-4">
            Ready to Explore Reader’s Paradise?
          </h2>
          <p className="text-lg text-[#3f3d3c] max-w-2xl mx-auto mb-6">
            Sign up today to enjoy our services and join our community of book
            lovers.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c1a36f] hover:text-black transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
