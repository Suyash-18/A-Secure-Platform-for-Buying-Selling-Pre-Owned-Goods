// server/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Try Authorization header first: "Bearer <token>"
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log("Auth headers:", authHeader);
  // console.log("Cookies:", req.cookies);

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2) Try cookies (both variants, just in case)
  if (!token && req.cookies?.AccessToken) {
    token = req.cookies.AccessToken;
  }
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verify error:", error?.name, error?.message);
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }
});
