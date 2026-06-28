import mongoose from "mongoose";

const savingGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceWorkspace",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    targetAmount: {
      type: Number,
      required: true,
    },

    currentAmount: {
      type: Number,
      default: 0,
    },

    deadline: {
      type: Date,
    },

    purpose: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

const SavingGoal = mongoose.model("SavingGoal", savingGoalSchema);

export default SavingGoal;