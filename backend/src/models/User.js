import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: false, // Remove duplicate index
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries - removed duplicate
// unique: true already creates an index

export default mongoose.model("User", userSchema);
