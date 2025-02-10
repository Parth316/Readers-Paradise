import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://parthprajapati316:Parth%40123@clustermain.gmnmr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMain");
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;