// server/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.AccessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the user to the request
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }
});
