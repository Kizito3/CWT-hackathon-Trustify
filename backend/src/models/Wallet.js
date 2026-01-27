import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        currentBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries on adminId
walletSchema.index({ adminId: 1 });

export default mongoose.model("Wallet", walletSchema);