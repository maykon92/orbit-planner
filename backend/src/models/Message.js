import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    editedAt: {
      type: Date,
    },

    deletedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      default: null,
    },

    storyPreview: {
      image: {
        type: String,
        default: "",
      },

      caption: {
        type: String,
        default: "",
      },

      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;