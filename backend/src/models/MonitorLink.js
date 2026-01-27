import mongoose from "mongoose";

const monitorLinkSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: false, // Remove duplicate
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster lookups - removed duplicate on token (unique already creates index)
monitorLinkSchema.index({ walletId: 1 });

export default mongoose.model("MonitorLink", monitorLinkSchema);
