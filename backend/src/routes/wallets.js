import express from "express";
import mongoose from "mongoose";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All wallet routes require authentication
router.use(authenticateToken);

// Get all wallets for logged-in admin
router.get("/", async (req, res) => {
  try {
    const wallets = await Wallet.find({ adminId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("name currentBalance createdAt");

    res.json({ wallets });
  } catch (error) {
    console.error("Get wallets error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new wallet
router.post("/", async (req, res) => {
  try {
    const { name, initialBalance } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Wallet name is required" });
    }

    const balance = initialBalance || 0;

    if (balance < 0) {
      return res
        .status(400)
        .json({ error: "Initial balance cannot be negative" });
    }

    const wallet = await Wallet.create({
      adminId: req.user.userId,
      name,
      currentBalance: balance,
    });

    // If there's an initial balance, create a transaction record
    if (balance > 0) {
      await Transaction.create({
        walletId: wallet._id,
        type: "inflow",
        amount: balance,
        balanceAfter: balance,
        description: "Initial balance",
      });
    }

    res.status(201).json({
      message: "Wallet created successfully",
      wallet,
    });
  } catch (error) {
    console.error("Create wallet error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single wallet details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    const wallet = await Wallet.findOne({
      _id: id,
      adminId: req.user.userId,
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json({ wallet });
  } catch (error) {
    console.error("Get wallet error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add inflow (add money)
router.post("/:id/inflow", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    if (!amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Get wallet and verify ownership
    const wallet = await Wallet.findOne({
      _id: id,
      adminId: req.user.userId,
    }).session(session);

    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Calculate new balance
    const newBalance = wallet.currentBalance + parseFloat(amount);

    // Update wallet balance
    wallet.currentBalance = newBalance;
    await wallet.save({ session });

    // Create immutable transaction record
    const transaction = await Transaction.create(
      [
        {
          walletId: id,
          type: "inflow",
          amount: parseFloat(amount),
          balanceAfter: newBalance,
          description: description || "Inflow",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.json({
      message: "Inflow added successfully",
      transaction: transaction[0],
      newBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Inflow error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
});

// Add outflow (remove money)
router.post("/:id/outflow", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    if (!amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Get wallet and verify ownership
    const wallet = await Wallet.findOne({
      _id: id,
      adminId: req.user.userId,
    }).session(session);

    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Calculate new balance
    const newBalance = wallet.currentBalance - parseFloat(amount);

    if (newBalance < 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update wallet balance
    wallet.currentBalance = newBalance;
    await wallet.save({ session });

    // Create immutable transaction record
    const transaction = await Transaction.create(
      [
        {
          walletId: id,
          type: "outflow",
          amount: parseFloat(amount),
          balanceAfter: newBalance,
          description: description || "Outflow",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.json({
      message: "Outflow added successfully",
      transaction: transaction[0],
      newBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Outflow error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
});

// Get transaction history for a wallet
router.get("/:id/transactions", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    // Verify wallet ownership
    const wallet = await Wallet.findOne({
      _id: id,
      adminId: req.user.userId,
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Get transactions
    const transactions = await Transaction.find({ walletId: id })
      .sort({ createdAt: -1 })
      .select("type amount balanceAfter description createdAt");

    res.json({ transactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete wallet
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    const wallet = await Wallet.findOneAndDelete({
      _id: id,
      adminId: req.user.userId,
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Note: Transactions will remain (immutable logs)
    // MonitorLinks will be handled by cascade if needed

    res.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Delete wallet error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
