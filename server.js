import express from "express";
import http from "http";
import { Server } from "socket.io";

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

  socket.on("join", ({ roomID, username }) => {
    console.log(`Joining room: ${roomID}`);
    console.log(`Username: ${username}`);

    userSocketMap[socket.id] = username;
    socket.join(roomID);

    const clients = getAllConnectedClients(roomID);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("change_code", ({ roomId, code }) => {
    socket.in(roomId).emit("change_code", { code });
  });

  socket.on("sync_code", ({ socketId, code }) => {
    console.log(socketId, "id");
    console.log(`Syncing code: ${code}`);
    io.to(socketId).emit("change_code", { code });
  });

  socket.on("disconnecting", () => {
    console.log(`Disconnecting: ${socket.id}`);
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      console.log(`Leaving room: ${roomId}`);
      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
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
