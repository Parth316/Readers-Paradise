import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send email to the backend
      const response = await axios.post("http://localhost:5000/api/auth/forgotPassword", {
        email,
      });

      // Handle success
      if (response.status === 200) {
        toast.success("A 4-digit code has been sent to your email.");
        console.log("Response:", response.data);

        // Navigate to the reset password page with the email as state
        navigate("/resetPassword", { state: { email } });
      }
    } catch (error) {
      // Handle error
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "An error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-left text-[#3f3d3c]">
          Forgot Password
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email for the verification process. We will send a 4-digit code to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Enter Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-[#c1a36f] focus:outline-none focus:ring-1 focus:ring-[#c1a36f]"
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-slate-600 p-3 text-white hover:bg-[#c1a36f] hover:text-black transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/2 py-20 flex items-center h-full justify-center">
        <img
          src="../images/forgotpass.png"
          alt="Illustration"
          className="w-[200px] md:w-[250px] lg:w-[600px] h-auto mx-auto"
        />
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ForgotPassword;