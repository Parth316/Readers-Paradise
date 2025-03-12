import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface IOrder extends Document {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: [
    {
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", orderSchema);