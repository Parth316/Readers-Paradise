import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth';
import bookRoutes from '../routes/book';
import connectDB from '../config/db';
import adminRoutes from '../routes/admin';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin',adminRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
});

export default app;