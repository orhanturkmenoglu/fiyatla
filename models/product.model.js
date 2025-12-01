import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true, "Barcode is require!"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Barcode is require!"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    comparison: [
      {
        market: { type: String, required: true },
        price: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    trend: [
      {
        price: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Product",productSchema);
