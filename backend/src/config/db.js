import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true }); // Suppress dotenv logs

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log(" MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB error:", err);
});

export default connectDB;
