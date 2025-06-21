import { Request, Response } from "express";
import Order from "../models/Orders";
import mongoose from "mongoose";
import Book from "../models/Book"; 

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: string|number;
  image?: string;
  isbn: string;
}

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, shippingAddress, totalAmount} = req.body;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!items || items.length === 0) {
      res.status(400).json({ message: "No items in the order" });
      return;
    }

    if (!shippingAddress || !totalAmount) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Start a MongoDB session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate and update stock for each item
      for (const item of items ) {
        // Find the book and validate stock
        const book = await Book.findById(item.bookId).session(session);
        if (!book) {
          throw new Error(`Book with ID ${item.bookId} not found`);
        }

        // Parse qty (string) to a number
        const currentStock = book.qty;
        if (isNaN(currentStock)) {
          throw new Error(`Invalid stock quantity for book: ${book.title}`);
        }

        // Check if there's enough stock
        if (currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for book: ${book.title}. Available: ${currentStock}, Requested: ${item.quantity}`
          );
        }

        // Decrease the stock and update the book using findOneAndUpdate
        const newStock = currentStock - item.quantity;
        const updatedBook = await Book.findOneAndUpdate(
          { _id: item.bookId },
          { qty: newStock.toString() },
          { new: true, session } // Return the updated document, include in the transaction
        );

        if (!updatedBook) {
          throw new Error(`Failed to update stock for book: ${item.bookId}`);
        }
      }

      // Create the order
      const order = new Order({
        userId,
        items,
        shippingAddress,
        totalAmount,
        status: "pending",
      });

      await order.save({ session });

      // Check for low stock books after updating
      const lowStockBooks = [];
      for (const item of items ) {
        const book = await Book.findById(item.bookId).session(session);
        if (book) {
          const stock = book.qty;
          if (stock < 5) {
            lowStockBooks.push({ title: book.title, stock });
          }
        }
      }

      // Commit the transaction
      await session.commitTransaction();

      res.status(201).json({
        message: "Order created successfully",
        order,
        lowStockBooks,
      });
    } catch (error: any) {
      // Roll back the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const packOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log("packOrder endpoint hit with ID:", req.params.id);
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    
    const order = await Order.findOne({ _id: id, userId });
    console.log("This is user is and id and order ids",userId, id,order);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // if (order.status !== "pending") {
    //   res.status(400).json({ message: "Order cannot be packed" });
    //   return;
    // }

    order.status = "packed";
    order.updatedAt = new Date();
    await order.save();

    // Mock shipping label URL (replace with actual carrier API integration in production)
    const labelUrl = `http://localhost:5000/shipping-labels/${order._id}.pdf`;
    res.status(200).json({ message: "Order packed successfully", labelUrl });
  } catch (error) {
    console.error("Error packing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};