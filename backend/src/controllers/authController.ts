//backend/controllers/authController.ts
import { Request, Response } from "express";
import User from "../models/User";
import { generateResetCode } from "../utils/emailService";
import { sendEmail } from "../utils/emailService";
import bcrypt from "bcryptjs";

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
 

export const sendPasswordResetCode = async (req: Request, res: Response):Promise<any>=> {
    const { email } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Generate a 4-digit reset code
      const resetCode = generateResetCode();
  
      // Save the reset code to the user's document
      user.resetCode = resetCode;
      await user.save();
  
      // Send the reset code via email
      await sendEmail({
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${resetCode}`,
      });
  
      res.status(200).json({ message: "A 4-digit code has been sent to your email." });
    } catch (error) {
      console.error("Error sending reset code:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };

  export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    const { email, resetCode, newPassword } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Verify the reset code
      if (user.resetCode !== resetCode) {
        return res.status(400).json({ message: "Invalid reset code." });
      }
  
      // Simply set the new password - let pre-save middleware handle hashing
      user.password = newPassword;
      user.resetCode = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };