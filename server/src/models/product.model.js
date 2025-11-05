import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 120 },
    description: { type: String, required: true, maxLength: 1000 },
    price: { type: Number, required: true },
    condition: {
      type: String,
      enum: ["New", "Like New", "Used"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    bills: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],

    warranty: {
      type: String, // example: "valid till 1-Mar-2026"
    },

    accessories: {
      type: String, // example: "Charger, Earphones"
    },

    category: { type: String, required: true },

    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
