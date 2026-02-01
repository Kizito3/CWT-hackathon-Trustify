import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallets.js";
import monitorRoutes from "./routes/monitor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cwt-hackathon-trustify.onrender.com",
      "https://cwt-hackathon-trustify-nxoz22m92-kizito3s-projects.vercel.app",
      "https://cwt-hackathon-trustify.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/monitor", monitorRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "mongodb",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parse Error:", err.message);
    return res.status(400).json({
      error: "Invalid JSON format",
      details: err.message,
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

export default app;
