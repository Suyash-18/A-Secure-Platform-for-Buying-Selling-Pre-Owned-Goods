import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

// normalize participants order to avoid duplicates due to order
chatSchema.pre("save", function(next) {
  if (Array.isArray(this.participants)) {
    // convert to string IDs and sort
    this.participants = this.participants.map(id => id.toString()).sort();
  }
  next();
});

// compound index to help prevent duplicates (works if participants array is consistent order)
chatSchema.index({ product: 1, participants: 1 }, { unique: true });

export const Chat = mongoose.model("Chat", chatSchema);
