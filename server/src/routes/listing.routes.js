import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// helper: upload buffer to cloudinary
async function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "refreshhom", public_id: filename, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}

// PUBLIC: list all active listings
router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = { status: "active" };
  if (q) filter.title = { $regex: q, $options: "i" };

  const listings = await Listing.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .limit(60);

  res.json(listings);
});

// PUBLIC: get listing by id
router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner", "name email");
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json(listing);
});

// AUTH: create listing (with images)
router.post("/", requireAuth, upload.array("images", 5), async (req, res) => {
  const { title, description, price } = req.body || {};
  if (!title || price == null) return res.status(400).json({ message: "Missing title/price" });

  const files = req.files || [];
  const images = [];
  for (const f of files) {
    const result = await uploadToCloudinary(f.buffer, `${Date.now()}-${f.originalname}`);
    images.push({ url: result.secure_url, publicId: result.public_id });
  }

  const listing = await Listing.create({
    owner: req.user.id,
    title,
    description,
    price: Number(price),
    images
  });

  res.status(201).json(listing);
});

// AUTH: get my listings
router.get("/me/mine", requireAuth, async (req, res) => {
  const listings = await Listing.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(listings);
});

// AUTH: update listing
router.put("/:id", requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  const { title, description, price, status } = req.body || {};
  if (title != null) listing.title = title;
  if (description != null) listing.description = description;
  if (price != null) listing.price = Number(price);
  if (status != null) listing.status = status;

  await listing.save();
  res.json(listing);
});

// AUTH: delete listing (and delete images from cloudinary)
router.delete("/:id", requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  for (const img of listing.images || []) {
    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch {}
    }
  }

  await listing.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;
