// models/Review.ts
import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  book: Schema.Types.ObjectId;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;