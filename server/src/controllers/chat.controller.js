import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

// Get or create chat
export const getOrCreateChat = async (req, res) => {
  const { productId, sellerId } = req.body;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      product: productId,
      users: { $all: [userId, sellerId] },
    });

    if (!chat) {
      chat = await Chat.create({
        product: productId,
        users: [userId, sellerId],
      });
    }

    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId }).populate("sender", "name _id");
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user._id;

  try {
    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      text,
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
