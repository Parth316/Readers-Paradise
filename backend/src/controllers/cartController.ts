import { Request, Response } from "express";
import Cart from "../models/Cart";

// Extend Request to include user from authMiddleware
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { items } = req.body;
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const saveCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { items } = req.body;
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const cart = new Cart({ userId, items });
    await cart.save();

    res.status(201).json({ message: "Cart saved successfully", cart });
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};