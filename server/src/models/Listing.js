import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    status: { type: String, enum: ["active", "sold"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
