import { io } from "socket.io-client";
import { API_BASE } from "./http";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(API_BASE, { transports: ["websocket"] });
  }
  return socket;
}
