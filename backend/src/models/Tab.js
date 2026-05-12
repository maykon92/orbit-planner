import mongoose from "mongoose";
import { ALLOWED_TAB_TYPES } from "../utils/constants.js";

const tabSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ALLOWED_TAB_TYPES,
    },

    icon: {
      type: String,
      default: "folder",
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: "folder",
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    aiEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tab = mongoose.model("Tab", tabSchema);

export default Tab;