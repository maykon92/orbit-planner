import mongoose from "mongoose";

const monthlyBudgetSchema = new mongoose.Schema(
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

    category: {
      type: String,
      required: true,
      enum: [
        "food",
        "rent",
        "transport",
        "subscriptions",
        "health",
        "shopping",
        "fun",
        "education",
        "visa",
        "phone",
        "other",
      ],
    },

    amount: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

monthlyBudgetSchema.index(
  { workspaceId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

const MonthlyBudget = mongoose.model("MonthlyBudget", monthlyBudgetSchema);

export default MonthlyBudget;