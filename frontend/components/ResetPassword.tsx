import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [resetCode, setResetCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const email = location.state?.email; // Access the email passed from ForgotPassword
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs
    if (!resetCode || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Email:", email); // Debug log
      // Send the reset code and new password to the backend
      const response = await axios.post("http://localhost:5000/api/auth/resetPassword", {
        email,
        resetCode,
        newPassword,
      });

      // Handle success
      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login"); // Redirect to the login page
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
          Reset Password
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Enter the 4-digit code you received and your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Reset Code</label>
          <input
            type="text"
            placeholder="Enter 4-digit code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-[#c1a36f] focus:outline-none focus:ring-1 focus:ring-[#c1a36f]"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-[#c1a36f] focus:outline-none focus:ring-1 focus:ring-[#c1a36f]"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-[#c1a36f] focus:outline-none focus:ring-1 focus:ring-[#c1a36f]"
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-slate-600 p-3 text-white hover:bg-[#c1a36f] hover:text-black transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
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

export default ResetPassword;