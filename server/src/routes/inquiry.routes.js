import express from "express";
import Inquiry from "../models/Inquiry.js";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// AUTH: list inquiries for a listing (for owner & sender)
router.get("/listing/:listingId", requireAuth, async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const isOwner = listing.owner.toString() === req.user.id;

  const filter = isOwner
    ? { listing: listingId }
    : { listing: listingId, fromUser: req.user.id };

  const inquiries = await Inquiry.find(filter)
    .populate("fromUser", "name email")
    .populate("toUser", "name email")
    .sort({ createdAt: 1 });

  res.json(inquiries);
});

// AUTH: create inquiry (and emit realtime)
router.post("/", requireAuth, async (req, res) => {
  const { listingId, message } = req.body || {};
  if (!listingId || !message) return res.status(400).json({ message: "Missing fields" });

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const toUser = listing.owner.toString();
  if (toUser === req.user.id) return res.status(400).json({ message: "Cannot inquire your own listing" });

  const inquiry = await Inquiry.create({
    listing: listingId,
    fromUser: req.user.id,
    toUser,
    message
  });

  // socket emit
  req.io?.to(`user:${toUser}`).emit("inquiry:new", {
    listingId,
    inquiryId: inquiry._id.toString()
  });

  const populated = await Inquiry.findById(inquiry._id)
    .populate("fromUser", "name email")
    .populate("toUser", "name email");

  res.status(201).json(populated);
});

export default router;
