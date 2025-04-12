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

const router = express.Router();

// POST: Create a product
router.post("/create", upload.array("images", 5), createProduct);

// GET: All products
router.get("/all", getAllProducts);

// GET: Single product by ID
router.get("/:id", getSingleProduct);

// PUT: Update a product
router.put("/update/:id", upload.array("images", 5), updateProduct);

// DELETE: Remove a product
router.delete("/delete/:id", deleteProduct);

// GET: Products by specific user
router.get("/user/:userId", getProductsByUser);

export default router;
