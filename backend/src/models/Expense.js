import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
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
        "other",
      ],
      default: "other",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "other"],
      default: "card",
    },

    notes: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      enum: ["manual", "ai"],
      default: "manual",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;