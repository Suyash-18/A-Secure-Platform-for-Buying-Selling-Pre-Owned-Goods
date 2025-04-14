import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsByUser
} from "../controllers/product.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js"; // ✅ Import auth middleware

const router = express.Router();

// POST: Create a product (🔐 protected)
router.post("/create", isAuthenticated, upload.array("images", 5), createProduct);

// GET: All products
router.get("/all", getAllProducts);

// GET: Single product by ID
router.get("/:id", getSingleProduct);

// PUT: Update a product (🔐 protected)
router.put("/update/:id", isAuthenticated, upload.array("images", 5), updateProduct);

// DELETE: Remove a product (🔐 protected)
router.delete("/delete/:id", isAuthenticated, deleteProduct);

// GET: Products by specific user (optional to protect)
router.get("/user/:userId", getProductsByUser);

export default router;
