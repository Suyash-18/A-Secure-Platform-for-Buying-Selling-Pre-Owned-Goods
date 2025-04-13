import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });


    // ✅ Delete the local file after successful upload
     fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // ✅ Ensure the file is removed even if upload fails
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      console.error("File deletion error:", err);
    }

    return null;
  }
};

export { uploadOnCloudinary };
