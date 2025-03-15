import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "da557ddb9b67da56f785b86fd52f65531f3e42333ff0c919573ecec091f03f7b5b7a2dfc344210639d1398ab899b01afedfa45031365f6b895972c087bd58a2ac397c915c415bd4920e5a7a68279e7cfee874a98e8fcf8ce04cb714f2a098268adbae37e48a7ca860cceb95864ab30bb7253ffa9bd160117c1df5d022c7d3492";
// Extend the Request interface to include user data
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: "Access token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded; // Attach user data to the request
    next(); // Call next() to pass control to the next handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};