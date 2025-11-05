import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    // Amount in paise (INR smallest unit)
    amount: { type: Number, required: true },

    // Razorpay details
    razorpay: {
      orderId: { type: String, required: true },
      paymentId: { type: String },
      signature: { type: String },
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
