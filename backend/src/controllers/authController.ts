//backend/controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";

export const register = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create a new user (schema's pre-save middleware will hash the password)
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;
    console.log("Request has reached the backend:", req.body);

    if (!email || !password) {
        res.status(400).json({ message: "Please provide email and password" });
        return;
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error("No user found with email:", email);
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.error("Invalid credentials for email:", email);
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        res.json({ message: "User authenticated successfully" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
 
