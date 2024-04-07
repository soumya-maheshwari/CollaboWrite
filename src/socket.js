import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const initializeSocket = async () => {
  console.log(backendUrl);
  if (!backendUrl) {
    throw new Error("Backend URL is not defined.");
  }

  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  try {
    const socket = io(backendUrl, options);
    return socket;
  } catch (error) {
    console.error("Socket connection error:", error);
    throw error;
  }
};
