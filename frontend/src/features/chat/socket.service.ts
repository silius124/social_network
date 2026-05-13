import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { token },
      transports: ["websocket"],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
