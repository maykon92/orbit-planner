import mongoose from "mongoose";

const financeWorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["personal", "shared"],
      default: "personal",
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["owner", "member"],
          default: "member",
        },

        status: {
          type: String,
          enum: ["active", "pending"],
          default: "active",
        },
      },
    ],
  },
  { timestamps: true }
);

const FinanceWorkspace = mongoose.model(
  "FinanceWorkspace",
  financeWorkspaceSchema
);

export default FinanceWorkspace;