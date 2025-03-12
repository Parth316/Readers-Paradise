import React,{useEffect,useState} from "react";
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
// import ErrorBoundary from "../components/ErrorBoundary";
import { useDispatch } from "react-redux";
import ResetPassword from "../components/ResetPassword";
import axios from "axios";
import Footer from "../components/Footer";
import Checkout from "../components/Checkout";
// App Component which contains navigation bar and routes
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")!)
          : null;

        if (token && user) {
          // Set axios header for subsequent requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Dispatch loginSuccess to restore the Redux state
          dispatch(loginSuccess({ token, user }));
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        // Optionally clear localStorage if token/user data is invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setIsLoading(false); // Set loading to false once session is restored
      }
    };

    restoreSession();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while restoring session
  }
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/addBooks" element={<AddBook />} />
          <Route path="/listBooks" element={<ListBooks />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/cart/empty" element={<EmptyCart />} />
          <Route path="/listUsers" element={<ListUsers />} />
          <Route path="/" element={<NewArrivals />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/:id/reviews" element={<BookDetail />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
          <Footer/>
      </Router>
    </>
  );
}

export default App;
