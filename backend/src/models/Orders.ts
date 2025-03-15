import mongoose, { Schema, Document } from 'mongoose';

interface IItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface IShippingAddress {
  recipientName: string; // New: Name of the recipient
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string; // New: Contact number
  email: string; // New: Contact email
  deliveryInstructions?: string; // New: Optional instructions
}

interface IOrder extends Document {
  userId: string;
  items: IItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  status: string;
  carrier?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ItemSchema: Schema = new Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const ShippingAddressSchema: Schema = new Schema({
  recipientName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  deliveryInstructions: { type: String },
});

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    items: [ItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'packed', 'shipped', 'delivered', 'cancelled'] },
    carrier: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;