// server/src/controllers/message.controller.js
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text } = req.body;
  const sender = req.user && req.user._id;

  if (!chatId || !text) {
    return res.status(400).json(new ApiResponse(400, null, "chatId and text are required"));
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid chatId"));
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json(new ApiResponse(404, null, "Chat not found"));
  }

  // Security: ensure sender is a participant of the chat
  if (!chat.participants.map((id) => id.toString()).includes(sender.toString())) {
    return res.status(403).json(new ApiResponse(403, null, "Not authorized to send message in this chat"));
  }

  const message = await Message.create({ chat: chatId, sender, text });

  // Update Chat.lastMessage and updatedAt so chats list sorts correctly
  await Chat.findByIdAndUpdate(
    chatId,
    { lastMessage: text, updatedAt: Date.now() },
    { new: true }
  );

  // TODO: emit via socket.io to participants if you use realtime

  res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid chatId"));
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json(new ApiResponse(404, null, "Chat not found"));
  }

  if (!chat.participants.map((id) => id.toString()).includes(req.user._id.toString())) {
    return res.status(403).json(new ApiResponse(403, null, "Not authorized to view messages in this chat"));
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "fullname avatar email")
    .sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});
