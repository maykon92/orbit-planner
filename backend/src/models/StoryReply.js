import mongoose from "mongoose";

const storyReplySchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

storyReplySchema.index({
  storyId: 1,
  createdAt: 1,
});

storyReplySchema.index({
  recipient: 1,
  isRead: 1,
});

const StoryReply = mongoose.model(
  "StoryReply",
  storyReplySchema
);

export default StoryReply;