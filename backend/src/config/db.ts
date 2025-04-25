import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Assuming backend is one level below the project root
const envPath = path.resolve(__dirname, '../.env'); // Adjust this based on your folder structure
console.log('Looking for .env file at:', envPath);

// Load environment variables from .env file
dotenv.config({ path: envPath });
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in the .env file');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;