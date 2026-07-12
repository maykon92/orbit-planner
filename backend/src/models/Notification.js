import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "comment", 
        "reply", 
        "like", 
        "follow", 
        "task", 
        "message",
        "finance_invitation",
        "finance_invitation_accepted",
        "story_like",
        "story_reply",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    financeInvitation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FinanceInvitation",
    },

    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;