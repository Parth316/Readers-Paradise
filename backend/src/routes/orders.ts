import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { createOrder, getOrders, getOrderById, packOrder } from "../controllers/orderController";

const router = Router();

// Create a new order
router.post("/create", authenticateToken, createOrder);

// Get all orders for the authenticated user
router.get("/", authenticateToken, getOrders);

// Get a specific order by ID
router.get("/:id", authenticateToken, getOrderById);

// Pack an order (update status to "packed" and generate shipping label)
router.post("/:id/pack", authenticateToken, packOrder);

// Optional: Could be used for order confirmation page if needed
router.get("/orderConfirmation", authenticateToken, getOrders);



export default router;