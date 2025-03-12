import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { createOrder, getOrders } from "../controllers/orderController";

const router = Router();

router.post("/create", authenticateToken, createOrder);
router.get("/", authenticateToken, getOrders);

export default router;