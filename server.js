import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomID) {
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[username],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log(socket, "socket");
  socket.on("join", ({ roomID, username }) => {
    console.log(roomID, "roomID");
    console.log(username, "username");

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
    socket.in(roomId).emit("change_code", {
      code,
    });
  });

  socket.on("sync_code", ({ socketId, code }) => {
    console.log(code);
    io.to(socketId).emit("change_code", {
      code,
    });
  });

  socket.on("disconnecting", () => {
    console.log(socket.rooms);
    const rooms = [...socket.rooms];
    console.log(rooms);
    rooms.forEach((roomId) => {
      console.log(roomId);
      socket.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`server listening at ${PORT}`));
