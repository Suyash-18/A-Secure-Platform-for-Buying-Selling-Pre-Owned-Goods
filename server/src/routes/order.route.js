import Order from "../models/order.model.js";   // <-- REQUIRED

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }) // <-- CORRECT MODEL
      .populate("items.product", "title price images") // populate product fields
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});
