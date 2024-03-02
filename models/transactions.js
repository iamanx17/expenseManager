const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    transaction_amount: {
      type: Number,
      required: true,
    },
    transaction_type: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    transactions_tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Tags",
      },
    ],
    transactions_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    transactions_note: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Transactions", transactionsSchema);
