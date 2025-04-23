import fs from "fs";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCoordinatesFromAddress } from "../utils/geocodeLocation.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, condition, category } = req.body;
  const seller = req.user?._id;

  let location = req.body.location;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Product images are required");
  }

  // Parse location if it's a JSON string
  location = typeof location === "string" ? JSON.parse(location) : location;

  if (!location?.address || !location.city || !location.state || !location.country) {
    throw new ApiError(400, "Incomplete location details");
  }

  // 🌍 Fetch coordinates
  const coordinates = await getCoordinatesFromAddress(location);

  let imageLinks = [];

  for (let file of req.files) {
    const uploadResult = await uploadOnCloudinary(file.path);
    if (uploadResult?.url) {
      imageLinks.push({
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      });
    }

    // 🔐 Safe delete of temp file
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      if (err.code !== "ENOENT") {
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
    location: {
      ...location,
      coordinates,
    },
    seller,
    images: imageLinks,
  });

  return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (req.user._id.toString() !== product.seller.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// export const getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find().populate("seller", "fullname username email");

//   res.status(200).json({
//     success: true,
//     message: "Fetched all products",
//     products,
//   });
// });
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 }) // Sort by newest first
    .populate("seller", "fullname username email");

  res.status(200).json({
    success: true,
    message: "Fetched all products",
    products,
  });
});


export const getProductsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const products = await Product.find({ seller: userId });

  res.status(200).json({
    success: true,
    message: "Fetched products by user",
    products,
  });
});

export const getSingleProduct = asyncHandler(async (req, res) => {
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
});

export const updateProduct = asyncHandler(async (req, res) => {
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
});
