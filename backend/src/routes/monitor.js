import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import MonitorLink from "../models/MonitorLink.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Generate monitor link (requires authentication - admin only)
router.post("/generate/:walletId", authenticateToken, async (req, res) => {
  try {
    const { walletId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return res.status(400).json({ error: "Invalid wallet ID" });
    }

    // Verify wallet ownership
    const wallet = await Wallet.findOne({
      _id: walletId,
      adminId: req.user.userId,
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    const baseUrl =
      process.env.APP_URL || `${req.protocol}://${req.get("host")}`;

    // Check if monitor link already exists
    const existingLink = await MonitorLink.findOne({ walletId });

    if (existingLink) {
      const monitorUrl = `${baseUrl}/monitor/${existingLink.token}`;

      return res.json({
        message: "Monitor link already exists",
        token: existingLink.token,
        monitorUrl,
        wallet: {
          id: wallet._id,
          name: wallet.name,
        },
      });
    }

    // Generate unique token
    const token = uuidv4();

    // Create monitor link
    const monitorLink = await MonitorLink.create({
      walletId,
      token,
    });

    const monitorUrl = `${baseUrl}/monitor/${token}`;

    // const monitorUrl = `${req.protocol}://${req.get("host")}/api/monitor/${token}`;

    res.status(201).json({
      message: "Monitor link created successfully",
      token: monitorLink.token,
      monitorUrl,
      wallet: {
        id: wallet._id,
        name: wallet.name,
      },
    });
  } catch (error) {
    console.error("Generate monitor link error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all monitor links for admin's wallets
router.get("/links", authenticateToken, async (req, res) => {
  try {
    const links = await MonitorLink.find()
      .populate({
        path: "walletId",
        match: { adminId: req.user.userId },
        select: "name",
      })
      .sort({ createdAt: -1 });

    // Filter out links where wallet is null (not owned by admin)
    const filteredLinks = links
      .filter((link) => link.walletId !== null)
      .map((link) => ({
        id: link._id,
        token: link.token,
        walletId: link.walletId._id,
        walletName: link.walletId.name,
        monitorUrl: `${baseUrl}/monitor/${link.token}`,
        createdAt: link.createdAt,
      }));

    res.json({ links: filteredLinks });
  } catch (error) {
    console.error("Get monitor links error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete monitor link (revoke access)
router.delete("/links/:token", authenticateToken, async (req, res) => {
  try {
    const { token } = req.params;

    // Find the monitor link
    const monitorLink = await MonitorLink.findOne({ token }).populate(
      "walletId",
    );

    if (!monitorLink) {
      return res.status(404).json({ error: "Monitor link not found" });
    }

    // Verify ownership
    if (monitorLink.walletId.adminId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await MonitorLink.deleteOne({ token });

    res.json({ message: "Monitor link deleted successfully" });
  } catch (error) {
    console.error("Delete monitor link error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUBLIC ROUTES (no authentication required) for monitors

// Get wallet info via monitor token (read-only)
router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const monitorLink = await MonitorLink.findOne({ token }).populate(
      "walletId",
      "name currentBalance createdAt",
    );

    if (!monitorLink) {
      return res.status(404).json({ error: "Invalid monitor link" });
    }

    const wallet = monitorLink.walletId;

    res.json({
      wallet: {
        id: wallet._id,
        name: wallet.name,
        currentBalance: wallet.currentBalance,
        createdAt: wallet.createdAt,
      },
      linkCreatedAt: monitorLink.createdAt,
      accessType: "read-only",
    });
  } catch (error) {
    console.error("Get monitor wallet error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get transaction history via monitor token (read-only)
router.get("/:token/transactions", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token and get wallet_id
    const monitorLink = await MonitorLink.findOne({ token });

    if (!monitorLink) {
      return res.status(404).json({ error: "Invalid monitor link" });
    }

    // Get transactions
    const transactions = await Transaction.find({
      walletId: monitorLink.walletId,
    })
      .sort({ createdAt: -1 })
      .select("type amount balanceAfter description createdAt");

    res.json({
      transactions,
      accessType: "read-only",
    });
  } catch (error) {
    console.error("Get monitor transactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
