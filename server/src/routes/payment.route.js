import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // in rupees

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

export default router;
