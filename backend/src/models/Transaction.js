import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["inflow", "outflow"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Make transactions immutable - disable updates and deletes
transactionSchema.pre("updateOne", function () {
  throw new Error("Transactions are immutable and cannot be updated");
});

transactionSchema.pre("findOneAndUpdate", function () {
  throw new Error("Transactions are immutable and cannot be updated");
});

transactionSchema.pre("deleteOne", function () {
  throw new Error("Transactions are immutable and cannot be deleted");
});

// Index for faster queries
transactionSchema.index({ walletId: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
