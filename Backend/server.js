// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a game
  socket.on("joinGame", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("playerJoined", socket.id);
  });

  // Handle moves
  socket.on("makeMove", (roomId, move) => {
    io.to(roomId).emit("moveMade", move);
  });

  // Handle game reset
  socket.on("reset", (roomId) => {
    console.log("reset called");
    io.to(roomId).emit("reset");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
