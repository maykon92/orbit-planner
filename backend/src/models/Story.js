import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({
  userId: 1,
  createdAt: -1,
});

const Story = mongoose.model("Story", storySchema);

export default Story;