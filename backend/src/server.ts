import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth';
import bookRoutes from '../src/routes/book';
import connectDB from './config/db';
import adminRoutes from '../src/routes/admin';
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin',adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});

export default app;