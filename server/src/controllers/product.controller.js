import fs from "fs";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCoordinatesFromAddress } from "../utils/geocodeLocation.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    condition,
    category,
    warranty,
    accessories,
  } = req.body;

  const seller = req.user?._id;
  let location = JSON.parse(req.body.location);

  // ✅ Check minimum 3 images
  if (!req.files || !req.files.images || req.files.images.length < 3) {
    throw new ApiError(400, "Minimum 3 product images are required");
  }

  // ✅ Get coordinates from address
  const coordinates = await getCoordinatesFromAddress(location);

  // ✅ Upload product images
  const imageLinks = [];
  for (let file of req.files.images) {
    const uploaded = await uploadOnCloudinary(file.path);
    if (uploaded && uploaded.url) {
      imageLinks.push({
        public_id: uploaded.public_id,
        url: uploaded.url,
      });
    }
  }

  // ✅ Upload Bills (optional)
  const billLinks = [];
  if (req.files.bills) {
    for (let file of req.files.bills) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded && uploaded.url) {
        billLinks.push({
          public_id: uploaded.public_id,
          url: uploaded.url,
        });
      }
    }
  }

  // ✅ Save product successfully
  const product = await Product.create({
    title,
    description,
    price,
    condition,
    category,
    seller,
    warranty,
    accessories,
    location: { ...location, coordinates },
    images: imageLinks,
    bills: billLinks,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});


export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
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
