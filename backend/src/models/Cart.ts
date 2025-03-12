import mongoose, { Schema, Document } from "mongoose";

interface CartItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ICart extends Document {
  userId: string;
  items: CartItem[];
}

const cartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  items: [
    {
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      image: { type: String },
    },
  ],
});

export default mongoose.model<ICart>("Cart", cartSchema);