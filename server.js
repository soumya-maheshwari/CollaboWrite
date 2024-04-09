import express from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "./src/Actions.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const userSocketMap = {};

function getAllConnectedClients(roomID) {
  const room = io.sockets.adapter.rooms.get(roomID);
  if (!room) return [];

  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    console.log(`Joining room: ${roomId}`);
    console.log(`Username: ${username}`);

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(clients, "clients");
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    console.log(socketId, "id");
    console.log(`Syncing code: ${code}`);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    console.log(`Disconnecting: ${socket.id}`);
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      console.log(`Leaving room: ${roomId}`);
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    console.log(userSocketMap, "map");
    delete userSocketMap[socket.id];
    socket.leaveAll();
  });

  socket.on("error", (error) => {
    console.error(`Socket error: ${error.message}`);
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the real time editor");
});
