import jwt from "jsonwebtoken";

export function setupSockets(io) {
  io.on("connection", (socket) => {
    // client sends token after connect
    socket.on("auth", (token) => {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.sub;
        socket.join(`user:${userId}`);
        socket.emit("auth:ok", { userId });
      } catch {
        socket.emit("auth:fail");
      }
    });

    socket.on("disconnect", () => {});
  });
}
