// app.ts --backend/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from '../routes/auth'
import bookRoutes from '../routes/book';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
export default app;