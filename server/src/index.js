import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";
import { createApp } from "./app.js";
import { setupSockets } from "./sockets/index.js";

async function main() {
  await connectDB(process.env.MONGODB_URI);
  initCloudinary();

  const app = createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true
    }
  });

  // attach io to req so routes can emit events
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  setupSockets(io);

  const port = Number(process.env.PORT || 8080);
  server.listen(port, () => console.log(`✅ Server on http://localhost:${port}`));
}

main().catch((e) => {
  console.error("❌ Failed to start", e);
  process.exit(1);
});
