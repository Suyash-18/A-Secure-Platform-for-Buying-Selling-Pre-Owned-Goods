import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js";

// If you have auth middleware that sets req.user, use it here:
// import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payment/create-order
 * body: { amount (in rupees), productId }
 * requires user (via auth middleware or passed userId)
 */
router.post("/create-order", /* requireAuth, */ async (req, res) => {
  try {
    const { amount, productId, userId: userIdFromBody } = req.body;

    // Prefer req.user?.id if you have auth:
    const userId = req.user?.id || userIdFromBody;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
    if (!amount || !productId) return res.status(400).json({ success: false, message: "amount and productId are required" });

    const options = {
      amount: Math.round(Number(amount) * 100), // rupees -> paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save a pending Order in DB
    const order = await Order.create({
      user: userId,
      product: productId,
      amount: options.amount,
      razorpay: { orderId: rzpOrder.id },
      status: "created",
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      dbOrderId: order._id,
    });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ success: false, message: "Could not create order" });
  }
});

/**
 * POST /api/payment/verify
 * body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId }
 * Verifies signature and marks order paid.
 */
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    const order = await Order.findById(dbOrderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (!isValid) {
      order.status = "failed";
      order.razorpay.paymentId = razorpay_payment_id;
      order.razorpay.signature = razorpay_signature;
      await order.save();
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Mark paid and save IDs
    order.status = "paid";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    await order.save();

    return res.json({ success: true, message: "Payment verified", orderId: order._id });
  } catch (err) {
    console.error("verify error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

export default router;
