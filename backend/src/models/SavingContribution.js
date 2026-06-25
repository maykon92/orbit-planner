import mongoose from "mongoose";

const savingContributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavingGoal",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SavingContribution = mongoose.model(
  "SavingContribution",
  savingContributionSchema
);

export default SavingContribution;