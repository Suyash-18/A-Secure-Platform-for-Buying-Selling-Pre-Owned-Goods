// server/src/controllers/product.controller.js
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, condition, category, location } = req.body;
  const seller = req.user?._id; // comes from isAuthenticated middleware

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Product images are required");
  }

  let imageLinks = [];

  for (let file of req.files) {
    const uploadResult = await uploadOnCloudinary(file.path);
    if (uploadResult?.url) {
      imageLinks.push({
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      });
    }

    // 🔐 safe delete local file
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Error deleting temp file: ${file.path}`, err);
      }
    }
  }

  const product = await Product.create({
    title,
    description,
    price,
    condition,
    category,
    location: typeof location === "string" ? JSON.parse(location) : location,
    seller,
    images: imageLinks
  });

  return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // Optional: Verify ownership before deleting (only seller can delete)
      if (req.user._id.toString() !== product.seller.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
  
      await product.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.error("Delete Product Error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  export const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate("seller", "fullname username email");
      res.status(200).json({
        success: true,
        message: "Fetched all products",
        products,
      });
    } catch (err) {
      console.error("Get All Products Error:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  export const getProductsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // ✅ use from route param
    const products = await Product.find({ seller: userId });

    res.status(200).json({
      success: true,
      message: "Fetched products by user",
      products,
    });
  } catch (err) {
    console.error("Get Products By User Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

  export const getSingleProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
      });
    } catch (err) {
      console.error("Get Single Product Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (err) {
      console.error("Update Product Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  