import mongoose from "mongoose";
import { ALLOWED_ITEM_STATUS } from "../utils/constants.js";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tabId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tab",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ALLOWED_ITEM_STATUS,
      default: "active",
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;