import { Request, Response } from "express";
import Order from "../models/Orders";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, shippingAddress, totalAmount } = req.body;

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

    const order = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
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