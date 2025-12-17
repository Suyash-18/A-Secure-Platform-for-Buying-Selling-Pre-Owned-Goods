import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const getOrCreateChat = asyncHandler(async (req, res) => {
  const { productId, sellerId } = req.body;
  const buyerId = req.user._id;

  if (!productId || !sellerId) {
    throw new ApiError(400, "productId and sellerId are required");
  }

  if (buyerId.toString() === sellerId.toString()) {
    throw new ApiError(400, "You cannot chat with yourself");
  }

  // normalize participants the same way as model pre-save
  const participants = [buyerId.toString(), sellerId.toString()].sort();

  // try to find existing chat
  let chat = await Chat.findOne({
    product: productId,
    participants: participants,
  }).populate("participants", "fullname avatar email");

  if (!chat) {
    try {
      chat = await Chat.create({
        product: productId,
        participants,
      });
      // populate for response
      await chat.populate("participants", "fullname avatar email");
    } catch (err) {
      // handle duplicate key error (race condition)
      if (err.code === 11000) {
        chat = await Chat.findOne({
          product: productId,
          participants: participants,
        }).populate("participants", "fullname avatar email");
      } else throw err;
    }
  }

  const messages = await Message.find({ chat: chat._id }).populate("sender", "fullname avatar email");

  res.status(200).json(
    new ApiResponse(200, { chat, messages }, "Chat fetched or created successfully")
  );
});

export const getChatByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const buyerId = req.user._id;

  const chat = await Chat.findOne({
    product: productId,
    participants: buyerId,
  }).populate("participants", "fullname avatar email");

  if (!chat) {
    return res
      .status(200)
      .json(new ApiResponse(200, { chat: null, messages: [] }, "No chat found"));
  }

  const messages = await Message.find({ chat: chat._id }).populate(
    "sender",
    "fullname avatar email"
  );

  res
    .status(200)
    .json(new ApiResponse(200, { chat, messages }, "Chat loaded successfully"));
});

export const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const chats = await Chat.find({ participants: userId })
    .populate("product", "title images price")          // show product info
    .populate("participants", "fullname avatar email")  // show buyer/seller
    .sort({ updatedAt: -1 });                           // newest chat first

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats for user loaded successfully"));
});
