import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getChatByProduct, getOrCreateChat, getUserChats } from "../controllers/chat.controller.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/get-or-create", isAuthenticated, getOrCreateChat);
router.post("/send", isAuthenticated, sendMessage);
router.get("/product/:productId", isAuthenticated, getChatByProduct); // specific before param
router.get("/:chatId", isAuthenticated, getMessages);
router.get("/", isAuthenticated, getUserChats);

export default router;
