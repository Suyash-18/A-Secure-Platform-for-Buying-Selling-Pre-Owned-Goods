// server/src/models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 120,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  price: {
    type: Number,
    required: true,
  },
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
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  ],
  category: {
    type: String,
    required: true,
    index: true,
  },
  location: {
    address: String, // optional user input like "MG Road, Pune"
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      }
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // must be tied to your user model
    required: true,
  }
}, {
  timestamps: true
});

export const Product = mongoose.model("Product", productSchema);
