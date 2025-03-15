import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "../components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../components/Home";
import About from "../components/About";
import Services from "../components/Services";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Explore from "../components/Explore";
import Index from "../admin/components/Index";
import AddBook from "../admin/components/AddBook";
import ListBooks from "../admin/components/ListBooks";
import ForgotPassword from "../components/ForgotPassword";
import EmptyCart from "../components/EmptyCart";
import ListUsers from "../admin/components/ListUsers";
import NewArrivals from "../components/NewArrivals";
import BookDetail from "../components/BookDetail";
import Cart from "../components/Cart";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import ResetPassword from "../components/ResetPassword";
import axios from "axios";
import Footer from "../components/Footer";
import Checkout from "../components/Checkout";
import OrderConfirmation from "../components/OrderConfirmation";
import ListOrders from "../admin/components/ListOrders";
import AllBooks from "../components/AllBooks";
import BookCarousel from "../components/BookCarousel";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import OrderProcess from "../admin/components/OrderProcess";
import PackedOrders from "../admin/components/PackedOrders";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")!)
          : null;

        if (token && user) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          dispatch(loginSuccess({ token, user }));
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} /> {/* Default route */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        {/* <Route path="/cart/empty" element={<EmptyCart />} /> */}
        <Route path="/newArrivals" element={<NewArrivals />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/:id/reviews" element={<BookDetail />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />
        <Route path="/addReview" element={<BookDetail />} />
        <Route
          path="/carousel"
          element={<BookCarousel category="newArrivals" />}
        />
        <Route path="/books/:category" element={<AllBooks />} />
        {/* Admin Routes */}
        <Route
          path="/adminPanel"
          element={
            <AdminProtectedRoute>
              <Index />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addBooks"
          element={
            <AdminProtectedRoute>
              <AddBook />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/listBooks"
          element={
            <AdminProtectedRoute>
              <ListBooks />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/listOrders"
          element={
            <AdminProtectedRoute>
              <ListOrders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/listUsers"
          element={
            <AdminProtectedRoute>
              <ListUsers />
            </AdminProtectedRoute>
          }
        />
        {/* <Route
        path="/orderProcess"
        element={
          <AdminProtectedRoute>
            <OrderProcess />
          </AdminProtectedRoute>
        }
      /> */}
        <Route
          path="/orderProcess/:orderId"
          element={
            <AdminProtectedRoute>
              <OrderProcess />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/packedOrders"
          element={
            <AdminProtectedRoute>
              <PackedOrders />
            </AdminProtectedRoute>
          }
        />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
