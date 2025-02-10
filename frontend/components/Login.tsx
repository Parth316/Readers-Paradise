import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { loginSuccess, loginFailure, resetError } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state: RootState) => state.auth.error);


    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateEmail(email)) {
            dispatch(loginFailure("Invalid email format"));
            return;
        }
        if (!validatePassword(password)) {
            dispatch(loginFailure("Password must be at least 8 characters long"));
            return;
        }

        try {
            console.log(email,password);
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });
            if (response) {
                console.log(response);
                dispatch(loginSuccess());
                alert("Login successful!");
                navigate("/home");
            } else {
                dispatch(loginFailure("Invalid email or password."));
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "An error occurred while trying to login.";
            dispatch(loginFailure(errorMessage));
        } finally {
            dispatch(resetError());
        }
    };

    return (
        <>
        <div className="py-20 sm: pt-28 min-h-screen flex flex-col md:flex-row items-center justify-center bg-amber-50">
            {/* Left Section */}
            <div className="pt-20 w-full md:w-1/2 px-6 md:px-20 lg:px-40 py-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-left text-[#3f3d3c]">LOGIN</h1>
            {error && <p className="text-red-500 mb-4 text-center md:text-left">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 md:py-3 lg:py-4 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f] placeholder-gray-400"
                            placeholder="Enter Email"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 md:py-3 lg:py-4 border border-gray-300 rounded-md text-[#3f3d3c] focus:outline-none focus:ring-2 focus:ring-[#d2b47f] placeholder-gray-400"
                            placeholder="Enter Password"
                        />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/forgot-password" className="text-sm text-[#3f3d3c] underline">Forgot Password?</Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-lg md:text-xl bg-slate-600 text-white py-3 md:py-4 rounded-full border-2 border-gray-600 hover:bg-[#c1a36f] hover:text-black transition duration-300"
                    >
                        LOGIN
                    </button>
                    <h1 className="my-2 align-center text-md text-center text-[#3f3d3c]">Don't have an account ?.<Link to="/signup" className="text-red-600 ">Sign up</Link></h1>
                </form>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 py-20 bg-gradient-to-l from-[#D89B30] to-[#FFD58D] rounded-l-full  flex items-center justify-center">
                <img
                    src="../images/loginimage.png"
                    alt="Illustration"
                    className="w-[200px] md:w-[250px] lg:w-[300px] h-auto mx-auto"
                />
            </div>
        </div>
        </>

    );
};

export default Login;
