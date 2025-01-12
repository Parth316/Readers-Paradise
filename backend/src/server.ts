// backend/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth';
import bookRoutes from '../routes/book';
import connectDB from '../config/db';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes with proper prefixes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});

export default app;