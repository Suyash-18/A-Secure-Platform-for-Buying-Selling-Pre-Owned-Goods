// server/src/controllers/product.controller.js
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      condition,
      category,
      status,
      location,
    } = req.body;

    // check for files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const imageUploadPromises = req.files.map((file) =>
        uploadOnCloudinary.uploader.upload(file.path, {
        folder: "preowned/products",
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Delete local temp files
    req.files.forEach((file) => fs.unlinkSync(file.path));

    const product = await Product.create({
      title,
      description,
      price,
      condition,
      category,
      status,
      images: uploadedImages.map((img) => ({
        public_id: img.public_id,
        url: img.secure_url,
      })),
      location: {
        ...location, // { address, city, state, country, coordinates }
        coordinates: {
          lat: parseFloat(location.coordinates.lat),
          lng: parseFloat(location.coordinates.lng),
        },
      },
      seller: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    console.error("Product Upload Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
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
      const userId = req.user._id; // assuming you're using middleware to attach user
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
  