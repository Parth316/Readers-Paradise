import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupSuccess, signupFailure, setError, resetError } from "../redux/authSlice";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => state.auth.error);
    // const navigate = useNavigate();

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetError());
        };
    }, [dispatch]);

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password: string): boolean => {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!validateEmail(formData.email)) {
            dispatch(setError("Please enter a valid email address"));
            return false;
        }
        
        if (!validatePassword(formData.password)) {
            dispatch(setError(
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
            ));
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            dispatch(setError("Passwords do not match"));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        dispatch(resetError());

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    email: formData.email,
                    password: formData.password
                }
            );
            dispatch(signupSuccess(response.data));
            console.log(response.data);
            alert("Sign up successful!");
            // navigate("/login"); // Navigate to login instead of home
        } catch (error: any) {
            const errorMessage = 
                error.response?.data?.message || 
                "Network error or server is not responding";
            dispatch(signupFailure(errorMessage));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen sm:pt-28 flex flex-col md:flex-row items-center justify-center bg-amber-50">
            {/* Left Section */}
            <div className="max-h-full sm:pt-28 py-20 w-full md:w-1/2 bg-gradient-to-r from-[#D89B30] to-[#FFD58D] rounded-r-full flex items-center justify-center">
                <img
                    src="../images/womanvector.png"
                    alt="Illustration"
                    className="w-60 sm:w-80 md:w-72 lg:w-80 xl:w-[400px] h-auto mx-auto"
                />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 px-6 md:px-20 lg:px-40 py-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#3f3d3c] text-center md:text-left">
                    Sign Up
                </h2>
                
                {error && (
                    <div className="text-red-500 mb-4 text-center md:text-left bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="w-full px-3 py-2 md:py-3 lg:py-4 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f] placeholder-gray-400"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full px-3 py-2 md:py-3 lg:py-4 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f] placeholder-gray-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full px-3 py-2 md:py-3 lg:py-4 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f] placeholder-gray-400"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-lg md:text-xl bg-slate-600 text-white py-3 md:py-4 rounded-full border-2 border-gray-600 transition duration-300 ${
                            isSubmitting 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-[#c1a36f] hover:text-black'
                        }`}
                    >
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-[#3f3d3c]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-600 hover:text-red-700">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;