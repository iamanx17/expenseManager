const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    budget_name: {
      type: String,
      required: true,
    },
    budget_total: {
      type: Number,
      required: true,
    },
    budget_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Budget", budgetSchema);
