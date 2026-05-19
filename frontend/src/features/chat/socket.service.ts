import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (socket && socket.auth && (socket.auth as any).token !== token) {
    socket.disconnect();
    socket = null;
  }
  if (!socket) {
    socket = io("http://192.168.1.101:3000", {
      auth: { token },
      transports: ["websocket"],
    });
  } else {
    socket.auth = { token };
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
