import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getCart, updateCart, saveCart} from "../controllers/cartController";

const router = Router();

router.get("/", authenticateToken, getCart);
router.post("/save", authenticateToken, saveCart);
router.post("/update", authenticateToken, updateCart);

export default router;