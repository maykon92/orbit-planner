import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
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

    source: {
      type: String,
      enum: ["salary", "freelance", "cash_job", "refund", "other"],
      default: "salary",
    },

    amount: {
      type: Number,
      required: true,
    },

    period: {
      type: String,
      enum: ["weekly", "monthly", "one_time"],
      default: "weekly",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);

export default Income;