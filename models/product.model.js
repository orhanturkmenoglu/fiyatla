import mongoose from "mongoose";
import priceSchema from "./price.model.js";

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true, "Barcode alanı zorunludur!"],
      unique: true,
      index: true,
      minlength: [8, "Barcode en az 8 karakter olmalıdır"],
    },
    name: {
      type: String,
      required: [true, "Ürün adı zorunludur!"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Marka zorunludur!"],
      trim: true,
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function (v) {
          // Boşsa geçerli, doluysa URL formatında olmalı
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
        },
        message: (props) => `${props.value} geçerli bir resim URL'si değil!`,
      },
    },
    description: {
      type: String,
      maxlength: [500, "Açıklama en fazla 500 karakter olabilir"],
    },
    prices: {
      type: [priceSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "En az bir fiyat bilgisi girilmelidir!",
      },
    },
    lowestPrice: {
      type: Number,
      default: null,
    },
    highestPrice: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  if (this.prices && this.prices.length > 0) {
    this.lowestPrice = Math.min(...this.prices.map((p) => p.price));
    this.highestPrice = Math.max(...this.prices.map((p) => p.price));
  } else {
    this.lowestPrice = null;
  }
});

export default mongoose.model("Product", productSchema);
