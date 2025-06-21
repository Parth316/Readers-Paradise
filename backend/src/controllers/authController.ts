import { Request, Response } from "express";
import User from "../models/User";
import { generateResetCode, sendEmail } from "../utils/emailService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET ;


// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    // Create a new user (role defaults to 'user' in schema)
    const newUser = new User({ name, email, password, role: "user" }); // Explicitly set role
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "48h" }
    );
    console.log(token);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role, // Include role in response
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login an existing user
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
      console.error("Invalid password for email:", email);
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "48h" }
    );

    res.status(200).json({
      message: "User authenticated successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role, // Include role in response
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send password reset code
export const sendPasswordResetCode = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate and save reset code
    const resetCode = generateResetCode();
    user.resetCode = resetCode;
    await user.save();

    // Send reset code via email
    await sendEmail({
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });

    res.status(200).json({ message: "A 4-digit code has been sent to your email" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ message: "An error occurred. Please try again" });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    res.status(400).json({ message: "Email, reset code, and new password are required" });
    return;
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify the reset code
    if (user.resetCode !== resetCode) {
      res.status(400).json({ message: "Invalid reset code" });
      return;
    }

    // Update password and clear reset code
    user.password = newPassword;
    user.resetCode = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "An error occurred. Please try again" });
  }
};