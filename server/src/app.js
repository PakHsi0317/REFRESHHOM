import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));

  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true
  }));

  app.use(rateLimit({ windowMs: 60_000, max: 240 }));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/listings", listingRoutes);
  app.use("/api/inquiries", inquiryRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
