import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string; // Added for consistency
}

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // Optionally redirect to home or login page
    window.location.href = "/"; // Simple redirect after logout
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCartData = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  };

  // Memoize the total quantity calculation
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]); // Recompute only when cartItems changes

  useEffect(() => {
    fetchCartData();
    window.addEventListener("storage", fetchCartData);
    return () => {
      window.removeEventListener("storage", fetchCartData);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-2 fixed w-full z-10">
      <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${showMobileMenu ? "hidden" : "block"} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className={`${showMobileMenu ? "block" : "hidden"} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img
                  className="h-10 w-auto"
                  src="../images/logo.png"
                  alt="Your Company"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex px-10 space-x-14 items-center">
                <Link
                  to="/home"
                  className="rounded-md px-3 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Services
                </Link>
                <Search />
              </div>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && user?.name ? (
              <>
                <span className="text-gray-300 font-semibold">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-[#c1a36f] hover:text-black transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            )}

            <div className="relative group">
              {/* Cart icon button - Navigate to /cart on click */}
              <Link
                to="/cart"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View cart</span>
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute mt-2 -top-0 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Dropdown - Show on hover */}
              <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 hidden group-hover:block">
                {cartItems.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="px-4 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-700">{item.title}</span>
                          <span className="text-gray-500">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2">
                      <Link
                        to="/cart"
                        className="block w-full text-center rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative ml-3 sm:hidden">
            <Link
              to="/cart"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View cart</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Dropdown - Show on hover */}
            <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 hidden group-hover:block">
              {cartItems.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="px-4 py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-700">{item.title}</span>
                        <span className="text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2">
                    <Link
                      to="/cart"
                      className="block w-full text-center rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
                    >
                      View Cart
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${showMobileMenu ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-2 px-4 pb-1 pt-1">
          <Link
            to="/home"
            className="block rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
            aria-current="page"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            About
          </Link>
          <Link
            to="/services"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Services
          </Link>
          {isAuthenticated && user?.name ? (
            <>
              <span className="block px-3 py-2 text-sm font-medium text-gray-300">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-[#c1a36f] hover:text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Sign Up
              </Link>
            </>
          )}
          <div className="px-3 py-2">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;